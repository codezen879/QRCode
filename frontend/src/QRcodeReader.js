import React, { useState } from 'react';
import jsQR from 'jsqr'; // Import the jsQR library

function QRCodeReader() {
  const [qrCodeData, setQRCodeData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dataFromBackend, setDataFromBackend] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setErrorMessage('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const image = new Image();
      image.src = event.target.result;

      image.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const imageData = ctx.getImageData(0, 0, image.width, image.height);

        const code = jsQR(imageData.data, image.width, image.height);

        if (code) {
          setQRCodeData(code.data);
          setErrorMessage('');

          // Send a GET request to your server with code.data as id
          const img = code.data;
          try {
          
                const response = await fetch(`http://localhost:5000/api/get-image`, {
                  method: 'POST', // Change the request method to POST
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ img }), // Send 'img' in the request body as JSON
                });
            if (response.ok) {
              const data = await response.json();
              if (data.img) {
                // Handle success and store data from the backend
                setDataFromBackend(data.img);
              } else {
                // Handle error
                setErrorMessage('Image not found');
              }
            } else {
              // Handle error
              setErrorMessage('Server error');
            }
          } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Server error');
          }
        } else {
          setErrorMessage('Error reading QR code.');
        }
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {errorMessage && <p>{errorMessage}</p>}
      {qrCodeData && (
        <div>
          <h2>QR Code Data:</h2>
          <p>{qrCodeData}</p>
        </div>
      )}
      {dataFromBackend && (
        <div>
          <h2>Data from Backend:</h2>
          <img src={dataFromBackend} alt="Image from Backend" />
        </div>
      )}
    </div>
  );
}

export default QRCodeReader;

