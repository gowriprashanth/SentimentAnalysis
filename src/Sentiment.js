import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sentiment() {
    const [data, setData] = useState({ ExtractedText: '', Sentiment: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


  
    useEffect(() => {
        axios.get('https://42v84a67m5.execute-api.us-east-1.amazonaws.com/prod/polarity')
          .then(response => {
            setData(JSON.parse(response.data.body)); // Parse the JSON strin
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            setError(error);
            setIsLoading(false);
          });
      }, []);
  
  
    return (
      <div>
        <h1>Extracted Text and Sentiment</h1>
        <p><strong>Extracted Text:</strong> {data.ExtractedText}</p>
        <p><strong>Sentiment:</strong> {data.Sentiment}</p>
      </div>
    );
}

export default Sentiment;