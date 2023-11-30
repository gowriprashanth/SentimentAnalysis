import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sentiment.css'; 

function Sentiment() {
  const [data, setData] = useState({ ExtractedText: '', Sentiment: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://42v84a67m5.execute-api.us-east-1.amazonaws.com/prod/polarity')
      .then(response => {
        setData(JSON.parse(response.data.body)); // Parse the JSON string
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="sentiment-container">
      <h1 className="sentiment-heading">Extracted Text and Sentiment</h1>
      <p><strong className="extracted-text-label">Extracted Text:</strong> <span>{data.ExtractedText}</span></p>
      <p><strong className="sentiment-label">Sentiment:</strong> <span>{data.Sentiment}</span></p>
    </div>
  );
}

export default Sentiment;
