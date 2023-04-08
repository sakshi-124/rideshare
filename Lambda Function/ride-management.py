import boto3
import json
import os
from boto3.dynamodb.conditions import Attr, And, Not
import datetime

dynamodb = boto3.resource('dynamodb')
sqs = boto3.client('sqs')
sns = boto3.client('sns')

cognito_client = boto3.client('cognito-idp')
user_pool_id = os.getenv('COGNITO_USER_POOL')
queue_name = os.getenv('QUEUE_NAME')
rides_table = os.getenv('RIDE_TABLE')
ride_request_table = os.getenv('RIDE_REQUEST_TABLE')
sns_topic_arn = os.getenv('SNS_TOPIC_ARN')
ride_confirmation_table = os.getenv('RIDE_CONFIRMATION_TABLE')


def lambda_handler(event, context):
    operationType = event['path']
    if operationType == 'postRide':
        response = handle_postRides(event, context)
        return response
    elif operationType == 'confirmRide':
        response = handle_confirmRides(event, context)
        return response
    elif operationType == 'availableRides':
        response = handle_rideDetails(event, context)
        return response
    elif operationType == 'rideRequest':
        response = handle_rideRequests(event, context)
        return response
    elif operationType == 'allRideRequests':
        response = handle_all_ride_requests(event, context)
        return response
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Invalid operation'})
        }


def getMaxId(table_name, field_name):
    table = dynamodb.Table(table_name)
    response = table.scan()
    response = response['Items'][0]
    response = str(response[field_name])
    maxId = int(response) + 1
    return str(maxId)


def getDetailsById(table_name, partition_key_field, partition_key_id):
    table = dynamodb.Table(table_name)
    response = table.scan(
        FilterExpression=Attr(str(partition_key_field)).eq(partition_key_id))
    return response['Items']


def getUserDetails(userSub):

    response = cognito_client.admin_get_user(
        UserPoolId=user_pool_id,
        Username=userSub,
    )
    return response


def handle_postRides(event, context):
    try:
        ride_details = event['rideDetails']
        newData = {"ride_id": int(getMaxId(rides_table, "ride_id"))}
        newData.update(ride_details)
        table = dynamodb.Table(rides_table)
        response = table.put_item(Item=newData)

        message = "Ride Available From" + " " + \
            newData['origin'] + " to " + newData['destination'] + \
            " via " + newData['stop'] + " on " + newData['ride_date']

        response = sns.publish(
            TopicArn=sns_topic_arn,
            Message=message,
            Subject='Ride Available',
            MessageStructure='string',
            MessageAttributes={
                'email': {
                    'DataType': 'String',
                    'StringValue': ride_details['userEmail']
                }
            }
        )

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error Posting a ride: ' + str(e)),
        }
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }


def handle_confirmRides(event, context):

    try:
        ride_det = event['rideDetails']

        confirmation_id = getMaxId(ride_confirmation_table, 'confirmation_id')
        ride_id = event['ride_id']
        request_id = event['request_id']

        confirmation_table = dynamodb.Table(ride_confirmation_table)
        main_rides_table = dynamodb.Table(rides_table)
        main_request_table = dynamodb.Table(ride_request_table)

        confirmRide = {
            "confirmation_id": int(confirmation_id),
            "ride_id": ride_id,
            "confirmation_date": datetime.date.today().isoformat(),
            "confirm_user_id": event['requested_by']
        }

        response = confirmation_table.put_item(Item=confirmRide)

        response = main_request_table.update_item(
            Key={'request_id': int(request_id)},
            UpdateExpression='SET isConfirmed = :val',
            ExpressionAttributeValues={':val': 'Y'}
        )

        if int(ride_det['available_seat']) > 1:
            response = main_rides_table.update_item(
                Key={'ride_id': int(ride_id)},
                UpdateExpression='SET available_seat = available_seat - :decrement',
                ExpressionAttributeValues={':decrement': 1},
                ReturnValues='UPDATED_NEW'
            )

        if int(ride_det['available_seat']) == 1:
            response = main_rides_table.update_item(
                Key={'ride_id': int(ride_id)},
                UpdateExpression='SET ride_status = :val',
                ExpressionAttributeValues={':val': 1}
            )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Ride confirmed successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred: {}'.format(str(e))})
        }


def handle_rideDetails(event, context):
    try:
        loggedInUser = event['loggedinUser']
        table_name = os.getenv('RIDE_TABLE')
        table = dynamodb.Table(table_name)
        attribute_name = 'status'
        attribute_value = 0

        response = table.scan(
            FilterExpression=And(
                Attr('ride_status').eq(0),
                Attr('ride_id').gt(0),
                # Not(Attr('posted_by').eq(loggedInUser))
            )
        )

        available_rides = (response['Items'])

        for ride in available_rides:
            user = getUserDetails(ride['posted_by'])
            userSub = ride['posted_by']
            user_details = {}
            for attribute in user['UserAttributes']:
                user_details[attribute['Name']] = attribute['Value']

            ride['posted_by'] = userSub + "," + \
                user_details['given_name'] + " " + user_details['family_name']

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error Fetching the ride Details: ' + str(e)),
        }

    return {
        'statusCode': 200,
        "AvailableRides": (available_rides)
    }


def handle_rideRequests(event, context):
    try:
        queue_url = sqs.get_queue_url(QueueName=queue_name)['QueueUrl']
        message = event['requestDetail']

        print("ride message", message)

        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps(message)
        )

        messages = sqs.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=1,
            VisibilityTimeout=0,
            WaitTimeSeconds=0
        )

        # print("polled messages" , messages)

        if 'Messages'not in messages:
            return {
                'statusCode': 404,
                'body': 'No messages found'
            }
        else:
            msg = messages['Messages'][0]
            message_body = json.loads(msg['Body'])

            sqs.delete_message(
                QueueUrl=queue_url,
                ReceiptHandle=msg['ReceiptHandle']
            )

            table = dynamodb.Table(ride_request_table)
            
            print("message_body", message_body)

            requestData = {"request_id": int(
                getMaxId(ride_request_table, "request_id"))}

            requestData.update(message_body)
            print("req data ", requestData)

            params = {
                'KeyConditionExpression': 'ride_id = :ride_id and requested_by = :requested_by',
                'ExpressionAttributeValues': {
                    ':ride_id': requestData['ride_id'],
                    ':requested_by': requestData['requested_by']
                },
                'Select': 'COUNT'
            }

            response = table.query(**params)
            count = response['Count']
            if count > 0:
                return{
                    'statusCode': 500,
                    'body': "Request Already Exists"
                }
 
            response = table.put_item(Item=requestData)
            print(requestData['ride_id'])

            ride_details = getDetailsById(
                rides_table, 'ride_id', int(requestData['ride_id']))

            print("ride det", (ride_details))
            '''user_details = {}
            
            for ride in ride_details:
                user = getUserDetails(ride['posted_by'])
                for attribute in user['UserAttributes']:
                    user_details[attribute['Name']] = attribute['Value']
                print(user_details)
            
            publisher_email = user_details['email']
            print(publisher_email)'''

            # commented -- need to do later

        ''' message = "You have got a ride request from" + " " + user_details['origin'] + " to " + user_details['destination'] + " by " + user_details['given_name'] + " " +  user_details['family_name']
            
            response = sns.publish(
            TopicArn=sns_topic_arn,
            Message=message,
            Subject='You got a Ride Request',
            MessageStructure='string',
            MessageAttributes={
                'email': {
                    'DataType': 'String',
                    'StringValue': publisher_email
                }
            }
            )'''

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error in a Ride Request: ' + str(e)),
        }
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }


def handle_all_ride_requests(event, context):
    try:
        currentUser = event['currentUser']
        table = dynamodb.Table(ride_request_table)
        allRequests = table.scan(FilterExpression=And(
            Attr('request_id').gt(0),
            Attr('isConfirmed').eq('N')
        )
        )
        allRequests = allRequests['Items']

        ridesTable = dynamodb.Table(rides_table)
        allRides = ridesTable.scan(FilterExpression=Attr('ride_id').gt(0))
        allRides = allRides['Items']

        ride_dict = {}

        for ride in allRides:
            ride_dict[ride['ride_id']] = ride

        for request in allRequests:
            ride_id = request['ride_id']
            ride_details = ride_dict.get(ride_id)
            if ride_details:
                request['ride_details'] = ride_details

        merged_data = allRequests

        for ride in merged_data:
            user = getUserDetails(ride['requested_by'])
            user_details = {}
            for attribute in user['UserAttributes']:
                userSub = ride['requested_by']
                user_details[attribute['Name']] = attribute['Value']

            ride['requested_by'] = user_details['given_name'] + \
                " " + user_details['family_name']
            ride['form'] = 'allRequests'
            ride['requested_by_sub'] = userSub

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error Posting a ride: ' + str(e)),
        }
    return {
        'statusCode': 200,
        'allRequests': merged_data
    }
