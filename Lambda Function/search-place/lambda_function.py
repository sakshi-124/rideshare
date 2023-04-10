import boto3
import os
import json

def lambda_handler(event, context):
    cloud_search_domain = os.getenv('CLOUD_SEARCH_DOMAIN')
    endpoint_url = os.getenv('CLOUD_SEARCH_ENDPOINT_URL')
    client = boto3.client('cloudsearchdomain', region_name='us-east-1' , endpoint_url = endpoint_url)

    search_query = event['search']

    try:

        search_parameters = {
            'query': search_query,
            'return': 'f__province,city',
            'size': 10
        }

        filter_expression = "(or f__province:'{0}' city:'{0}')".format(search_query)

        search_parameters['filterQuery'] = filter_expression
        search_response = client.search(**search_parameters)

        province_values = [hit['fields']['f__province'] for hit in search_response['hits']['hit']]
        city_values = [hit['fields']['city'] for hit in search_response['hits']['hit']]
        
        city_province = [{"label" : f"{city}, {prov}" }for prov, city in zip(province_values, city_values)]
        for item in city_province:
            item["label"] = item["label"].replace("[", "").replace("]", "").replace("'","")
        
    except Exception as  e: 
         return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred: {}'.format(str(e))})
        }

    return {
        'statusCode': 200,
        "result": json.dumps(city_province)
    }


