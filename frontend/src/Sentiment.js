import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './Sentiment.css'; 

function Sentiment() {
  const [data, setData] = useState({ ExtractedText: '', Sentiment: '', SentimentScore: 0, Subject: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://u0e8x85ktk.execute-api.us-east-1.amazonaws.com/prod/polarity-analysis")
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
    <div className="sentiment-container">
      <h1 className="sentiment-heading">Extracted Text and Sentiment</h1>
      <p><strong className="extracted-text-label">Extracted Text:</strong> <span>{data.ExtractedText}</span></p>
      <p><strong className="sentiment-label">Sentiment Analysis:</strong> <span>{data.Sentiment}</span></p>
    
    <div style={{ maxWidth: "650px" }}>
        <Bar data= {{
          labels:["Sentiment Score","Subjectivity Score"],
          datasets:[
            {
            label: "Sentiment",
            data:[ data.SentimentScore, data.Subject ],
            backgroundColor:["#d41c1c","#007BFF"],
            borderWidth: 0.5,
            
          },
        ],
        }}
        
        

        // options={{
        //     maintainAspectRatio: false,
        //     scales: {
        //         yAxes: [
        //             {
        //                 ticks: {
        //               // The y-axis value will start from zero
        //                     beginAtZero: true,
        //                 },
        //             },
        //         ],
        //     },
        //     legend: {
        //         labels: {
        //             fontSize: 15,
        //         },
        //     },
        // }}

        />
        </div>
      </div>
    
  );
}

export default Sentiment;
