import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import Sentiment from './Sentiment';
import SentimentText from './SentimentText';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
        <Route path="/sentiment" element={<Sentiment />} />
        <Route path="/SentimentText" element={<SentimentText />} />
      </Routes>
    </Router>
  );
}

export default App;