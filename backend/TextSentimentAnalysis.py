import json
import boto3
from textblob import TextBlob

def stemmer(word):
    suffixes = ['ing', 'ly', 'ed', 'ious', 'ies', 'ive', 'es', 's', 'ment']
    for suffix in suffixes:
        if word.endswith(suffix):
            return word[:-len(suffix)]
    return word

def stem_sentence(sentence):
    words = sentence.split()
    stemmed_words = [stemmer(word) for word in words]
    return ' '.join(stemmed_words)

def tokenize_sentence(sentence):
    special_characters = ['!','"','#','$','%','&','(',')','*','+','/',':',';','<','=','>','@','[','\\',']','^','`','{','|','}','~','\t']
    for i in special_characters : 
        sentence = sentence.replace(i, '')
    return sentence
    
def remove_stopwords(sentence):
    stop_words = ["a", "an", "the", "and", "but", "or", "because", "as", "until", "while", "of", "at", "by", "for",
    "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to",
    "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", 
    "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some","such", 
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "can", "will", "just"]
    words = sentence.split()
    filtered_words = [] 
    for word in words:
        if word not in stop_words:
            filtered_words.append(word) 
    return  ' '.join(filtered_words)
    
def read_text_file(bucket, document):
    s3 = boto3.client('s3')
    file = s3.get_object(Bucket=bucket, Key=document)
    text = file["Body"].read().decode('utf-8')
    return text

def lambda_handler(event, context):
    # Extract S3 bucket name and text file name from the event
    bucket = 'texttract-sentiment'
    document = 'file.txt'
    
    if not bucket or not document:
        return {
            'statusCode': 400,
            'header': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps('Bucket or document not provided')
        }

    try:
        # Read text from the text file
        extracted_text = read_text_file(bucket, document)
        token = tokenize_sentence(extracted_text)
        stop_words_remove = remove_stopwords(token)
        processed_text  = stem_sentence(stop_words_remove)
        
        # Perform sentiment analysis using TextBlob
        blob = TextBlob(processed_text)
        sentiment = blob.sentiment.polarity
        subject = blob.sentiment.subjectivity
        
        # Determine the overall sentiment
        if sentiment > 0 and sentiment != 5.551115123125783e-17:
            overall_sentiment = 'Positive'
        elif sentiment < 0 and sentiment > -1:
            overall_sentiment = 'Negative'
        else:
            overall_sentiment = 'Neutral'

        return {
            'statusCode': 200,
            'header': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'ExtractedText': extracted_text, 'Sentiment': overall_sentiment, 'SentimentScore': sentiment,'Subject': subject})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'header': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps(f'Error processing document: {str(e)}')
        }

