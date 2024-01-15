import boto3
import base64
import json
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Your S3 bucket name
    bucket_name = 'texttract-sentiment'

    # Get the image data from the event
    image_data = event['body']
    
    # Decode the image data
    image = base64.b64decode(image_data)
    
    # Specify the object key (filename in the bucket)
    object_key = 'image.jpg'

    # Initialize S3 client
    s3_client = boto3.client('s3')

    try:
        # Upload the image to S3
        s3_client.put_object(Bucket=bucket_name, Key=object_key, Body=image)
        return {
            'statusCode': 200,
            'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
            'body': json.dumps('Image uploaded successfully!')
        }
    except ClientError as e:
        print(e)
        return {
            'statusCode': 500,
            'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
            'body': json.dumps('Error uploading the image.')
        }