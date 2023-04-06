import boto3
import json
import os
from boto3.dynamodb.conditions import Attr,And,Not

dynamodb = boto3.resource('dynamodb')
cognito_client = boto3.client('cognito-idp')
user_pool_id = os.getenv('COGNITO_USER_POOL')

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

def handle_postRides(event,context):
    try:
        table_name = os.getenv('RIDE_TABLE')
        ride_details = event['rideDetails']
        newData = {"ride_id": int(getMaxId(table_name, "ride_id"))}
        newData.update(ride_details)
        table = dynamodb.Table(table_name)
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


def getUserDetails(userSub):

    response = cognito_client.admin_get_user(
        UserPoolId=user_pool_id,
        Username=userSub,
    )
    return response

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
