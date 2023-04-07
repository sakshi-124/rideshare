import boto3
import json
import os
from boto3.dynamodb.conditions import Attr,And,Not

dynamodb = boto3.resource('dynamodb')
sqs = boto3.client('sqs')
sns = boto3.client('sns')

cognito_client = boto3.client('cognito-idp')
user_pool_id = os.getenv('COGNITO_USER_POOL')
queue_name = os.getenv('QUEUE_NAME')
rides_table = os.getenv('RIDE_TABLE')
ride_request_table = os.getenv('RIDE_REQUEST_TABLE')
sns_topic_arn = os.getenv('SNS_TOPIC_ARN')

def lambda_handler(event, context):
    operationType = event['path']
    if operationType == 'postRide':
        response =  handle_postRides(event,context)
        return response
    # elif operationType == 'confirmRide':
    #     response = handle_confirmRides(event,context)
    #     return response
    elif operationType == 'availableRides':
         response =  handle_rideDetails(event,context)
         return response
    elif operationType == 'rideRequest':
         response =  handle_rideRequests(event,context)
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

def getDetailsById(table_name , partition_key_field ,partition_key_id):
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
    
def handle_postRides(event,context):
    try:
        ride_details = event['rideDetails']
        newData = {"ride_id": int(getMaxId(rides_table, "ride_id"))}
        newData.update(ride_details)
        table = dynamodb.Table(rides_table)
        response = table.put_item(Item=newData)

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error Posting a ride: ' + str(e)),
        }
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }


# def handle_confirmRides(event,context):
#     verification_code = event['verificationCode']
#     user_name = event['email']

#     try:
#         response = client.confirm_sign_up(
#             ClientId=client_id,
#             Username=user_name,
#             ConfirmationCode=verification_code,
#         )
#         #users = client.list_users(
#           #  UserPoolId=user_pool_id)
#         return {
#             'statusCode': 200,
#             'body': json.dumps({'message': 'User confirmed successfully'})
#         }
#     except Exception as e:
#         return {
#             'statusCode': 500,
#             'body': json.dumps({'message': 'An error occurred: {}'.format(str(e))})
#         }

def handle_rideDetails(event,context):
    try:
        loggedInUser = event['loggedinUser']
        table_name = os.getenv('RIDE_TABLE')
        table = dynamodb.Table(table_name)
        attribute_name = 'status'
        attribute_value = 0
    
        response = table.scan(
        FilterExpression=And(
        Attr('status').eq(0),
        Attr('ride_id').gt(0),
        #Not(Attr('posted_by').eq(loggedInUser))
        )
        )
        
        available_rides = (response['Items'])
    
        for ride in available_rides:
            user = getUserDetails(ride['posted_by'])
            user_details = {}
            for attribute in user['UserAttributes']:
                user_details[attribute['Name']] = attribute['Value']
                
            ride['posted_by'] = user_details['given_name'] + " " + user_details['family_name']
       
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
        
        #print(message)
        
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps(message)
        )
        
        #print(response)
        
        messages = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=1,
        VisibilityTimeout=0,
        WaitTimeSeconds=0
        )

        #print("polled messages" , messages)
        
        if 'Messages'not in messages:
            return {
                'statusCode': 404,
                'body': 'No messages found'
            }
        else :
            msg = messages['Messages'][0]
            message_body = json.loads(msg['Body'])

            sqs.delete_message(
            QueueUrl=queue_url,
            ReceiptHandle=msg['ReceiptHandle']
            )
            
            table = dynamodb.Table(ride_request_table) 
            newData = {"request_id": int(getMaxId(ride_request_table, "request_id"))}
            
            newData.update(message_body)
            print(newData)
            
            response = table.put_item(Item=newData)
            print(newData['ride_id'])
            ride_details = getDetailsById(rides_table,'ride_id',int(newData['ride_id']))
            
            print("ride det" , (ride_details))
            user_details = {}
            
            for ride in ride_details:
                user = getUserDetails(ride['posted_by'])
                for attribute in user['UserAttributes']:
                    user_details[attribute['Name']] = attribute['Value']
                print(user_details)
            
            publisher_email = user_details['email']
            print(publisher_email)
            
             # Check if the email is already subscribed to the topic

            message = "You have got a ride request from" + " " + user_details['origin'] + " to " + user_details['destination'] + " by " + user_details['given_name'] + " " +  user_details['family_name']
            
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
            )      
            
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error in a Ride Request: ' + str(e)),
        }
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
