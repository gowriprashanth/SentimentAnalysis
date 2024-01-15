import json
import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'texttract-sentiment'
    file_name = 'file.txt' 

    try:
        s3.put_object(Bucket=bucket_name, Key=file_name, Body=event['body'])
        return {
            'statusCode': 200,
            'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
            'body': json.dumps('File uploaded successfully.')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
            'body': json.dumps(str(e))
        }
