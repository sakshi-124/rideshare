import boto3
import json
import os
from botocore.exceptions import ClientError

client = boto3.client('cognito-idp')
sns = boto3.client('sns')

client_id = os.getenv('COGNITO_CLIENT_ID')
user_pool_id = os.getenv('COGNITO_USER_POOL_ID')
sns_topic_arn = os.getenv('SNS_TOPIC_ARN')


def lambda_handler(event, context):
    operationType = event['path']
    if operationType == 'registerUser':
        response = handle_signup(event, context)
        return response
    elif operationType == 'confirmUser':
        response = handle_confirmation(event, context)
        return response
    elif operationType == 'signin':
        response = handle_signin(event, context)
        return response
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Invalid operation'})
        }


def handle_signup(event, context):
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
        subscribers = sns.list_subscriptions_by_topic(TopicArn=sns_topic_arn)
        subscribed_emails = [sub['Endpoint']
                             for sub in subscribers['Subscriptions']]

        if user_name not in subscribed_emails:

            response = sns.subscribe(
                TopicArn=sns_topic_arn,
                Protocol='email',
                Endpoint=user_name
            )
    except ClientError as e:
        if e.response['Error']['Code'] == 'UsernameExistsException':
            return {
                'statusCode': 500,
                'body': json.dumps('user already exists'),
            }
        else:
            return {
                'statusCode': 500,
                'body': json.dumps('Error registering user: ' + str(e)),
            }

    return {
        'statusCode': 200,
        'body': json.dumps('Registerd')
    }


def handle_confirmation(event, context):
    verification_code = event['verificationCode']
    user_name = event['email']

    try:
        response = client.confirm_sign_up(
            ClientId=client_id,
            Username=user_name,
            ConfirmationCode=verification_code,
        )

        message = "Thanks for subscribing RideShare to receive ride related informations"

        response = sns.publish(
            TopicArn=sns_topic_arn,
            Message=message,
            Subject='Subscription Confirmation',
            MessageStructure='string',
            MessageAttributes={
                    'email': {
                        'DataType': 'String',
                        'StringValue': user_name
                    }
            }
        )

        # users = client.list_users(
        #  UserPoolId=user_pool_id)
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User confirmed successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred: {}'.format(str(e))})
        }


def handle_signin(event, context):
    user = event['user']
    username = user['email']
    password = user['password']

    try:
        response = client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            },
            ClientId=client_id
        )

        userDetails = client.get_user(
            AccessToken=response['AuthenticationResult']['AccessToken']
        )

        user_details = {}

        for attribute in userDetails['UserAttributes']:
            user_details[attribute['Name']] = attribute['Value']

        response_body = {

        }
        return {
            'statusCode': 200,
            "userDetails": user_details
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
