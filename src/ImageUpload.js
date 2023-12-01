import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ImageUpload.css'; // Import the CSS file

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [inputType, setInputType] = useState('photo'); // State to track the input type
  const [textInput, setTextInput] = useState(''); // State for text input
  const navigate = useNavigate();

  // Handles file selecti
  const onFileChange = event => {
    setUploadStatus('');
    setSelectedFile(event.target.files[0]);
  };

  // Handles text input change
  const onTextInputChange = event => {
    setTextInput(event.target.value);
  };

  // Handles input type change (photo or text)
  const onInputTypeChange = event => {
    setInputType(event.target.value);
  };

  // Handles file upload
  const onFileUpload = () => {
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

      axios
        .post("https://8cixrhnhu1.execute-api.us-east-1.amazonaws.com/dev/upload-image", { body: base64String })
        .then(response => {
          console.log("File uploaded successfully", response);
          setUploadStatus('Upload successful!');
          setTimeout(() => navigate('/Sentiment'), 2500);
        })
        .catch(error => {
          console.error("Error uploading file", error);
          setUploadStatus('Error uploading file.');
        });
    };

    reader.readAsDataURL(selectedFile);
  };

  // Handles text upload
  const onTextUpload = () => {
    axios
      .post("https://2ivw0zgzkj.execute-api.us-east-1.amazonaws.com/dev/upload-text", { body: textInput })
      .then(response => {
        console.log("Text uploaded successfully", response);
        setUploadStatus('Upload successful!');
        setTimeout(() => navigate('/SentimentText'), 2500);
      })
      .catch(error => {
        console.error("Error uploading text", error);
        setUploadStatus('Error uploading text.');
      });
  };

  // Function to handle the overall upload based on type
  const onUpload = () => {
    if (inputType === 'photo' && selectedFile) {
      onFileUpload();
    } else if (inputType === 'text' && textInput) {
      onTextUpload();
    } else {
      setUploadStatus('Please select a file or enter text to upload.');
    }
  };

  // Display file details
  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Select a file before pressing the upload button</h4>
        </div>
      );
    }
  };

  // Text input area
  const textInputArea = () => {
    return (
      <div>
        <textarea
          value={textInput}
          onChange={onTextInputChange}
          placeholder="Enter text here"
          className="text-input"
        />
      </div>
    );
  };

  return (
    <div className="upload-container">
      <h1>Upload Content</h1>
      <div className="input-type-selector">
        <label>
          <input
            type="radio"
            value="photo"
            checked={inputType === 'photo'}
            onChange={onInputTypeChange}
          />
          Photo
        </label>
        <label>
          <input
            type="radio"
            value="text"
            checked={inputType === 'text'}
            onChange={onInputTypeChange}
          />
          Text
        </label>
      </div>
      {inputType === 'photo' ? (
        <>
          <input type="file" onChange={onFileChange} />
          {fileData()}
        </>
      ) : (
        textInputArea()
      )}
      <button onClick={onUpload}>Upload</button>
      <p className={`upload-status ${uploadStatus ? 'success' : 'error'}`}>{uploadStatus}</p>
    </div>
  );
};

export default ImageUpload;
