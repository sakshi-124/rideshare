import json
import boto3


def lambda_handler(event, context):

    client = boto3.client('cognito-idp')
    client_id = "jicg7rc6e33n4i49dd0ldhu9r"
    user_pool_id = "us-east-1_C3P4kY7MN"

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
    return{
                'statusCode': 200,
                'body': json.dumps('Registerd'),
                'headers': {
                    {'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': '*'}
                }
            }

import boto3
import json

def lambda_handler(event, context):
    # Initialize the Cognito client
    client = boto3.client('cognito-idp')
    
    # Retrieve the user pool ID and client ID from the environment variables
    user_pool_id = "us-east-1_C3P4kY7MN"
    client_id = "jicg7rc6e33n4i49dd0ldhu9r"
    
    # Retrieve the verification code and user name from the event
    verification_code = event['verificationCode']
    user_name = event['email']
    
    # Call the confirm_signup method to confirm the user
    response = client.confirm_sign_up(
        ClientId=client_id,
        Username=user_name,
        ConfirmationCode=verification_code,
    )
    
    # Return a success message
    return {
        'statusCode': 200,
        'body': json.dumps('User confirmed successfully')
    }
