import boto3
import json
import os

client = boto3.client('cognito-idp')
client_id = os.getenv('')
user_pool_id = os.getenv('')

def lambda_handler(event, context):
    operationType = event['operation']
    if operationType == 'signup':
        return handle_signup(event)
    elif operationType == 'confirm':
        return handle_confirmation(event)
    elif operationType == 'signin':
        return handle_signin(event)
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Invalid operation'})
        }


def handle_signup(event):
    user_attributes = event['userAttributes']
    user_name = event['email']
    password = event['password']
   # custom_attributes = event['customAttributes']
    try:
        response = client.sign_up(
            ClientId=client_id,
            Username=user_name,
            Password=password,
            UserAttributes=user_attributes,
        )

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error registering user: ' + str(e)),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': '*'
            }
        }
    return {
        'statusCode': 200,
        'body': json.dumps('Registerd'),
        'headers': {
            {'Access-Control-Allow-Origin': '*',
             'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
             'Access-Control-Allow-Methods': '*'}
        }
    }


def handle_confirmation(event):
    verification_code = event['verificationCode']
    user_name = event['email']

    try:
        response = client.confirm_sign_up(
            ClientId=client_id,
            Username=user_name,
            ConfirmationCode=verification_code,
        )
        users = client.list_users(
            UserPoolId=user_pool_id)
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User confirmed successfully'}),
            'users' : users['Users']
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred: {}'.format(str(e))})
        }


def handle_signin(event):
    username = event['email']
    password = event['password']

    try:
        response = client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            },
            ClientId='YOUR_APP_CLIENT_ID'
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'accessToken': response['AuthenticationResult']['AccessToken']
            })
        }
    except client.exceptions.UserNotFoundException:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'User not found'})
        }
    except client.exceptions.NotAuthorizedException:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Incorrect username or password'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred: {}'.format(str(e))})
        }
