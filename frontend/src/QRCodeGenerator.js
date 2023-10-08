import React, { useState } from 'react';
import QRCode from 'qrcode'; // Import the qrcode library

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [backendResponse, setBackendResponse] = useState('');

  const generateQRCode = () => {
    if (text.trim() === '') {
      alert('Please enter some text.');
      return;
    }

    // Generate the QR code data URL
    QRCode.toDataURL(text)
      .then((dataUrl) => {
        setDownloadLink(dataUrl);

        // Send the QR code URL to the backend
        sendQRCodeUrlToBackend(dataUrl);
      })
      .catch((error) => {
        console.error('Error generating QR code:', error);
      });
  };

  const sendQRCodeUrlToBackend = (qrCodeUrl) => {
    // Make an HTTP POST request to your backend API endpoint
    fetch('http://localhost:5000/api/post-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qrCodeUrl }), // Send the QR code URL in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBackendResponse('QR code URL sent to backend successfully.');
        } else {
          console.error('Error sending QR code URL to backend:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error sending QR code URL to backend:', error);
      });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setDownloadLink('');
    setBackendResponse('');
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <div>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter text to generate QR code"
          value={text}
          onChange={handleTextChange}
        ></textarea>
      </div>
      <div>
        <button onClick={generateQRCode}>Generate QR Code</button>
      </div>
      {downloadLink && (
        <div>
          <h2>Generated QR Code</h2>
          <img src={downloadLink} alt="QR Code" />
          <a
            href={downloadLink}
            download="qrcode.png"
            style={{ display: 'block', marginTop: '10px' }}
          >
            Download QR Code
          </a>
        </div>
      )}
      {backendResponse && <p>{backendResponse}</p>}
    </div>
  );
}

export default QRCodeGenerator;

