import React, { useState, useEffect } from "react";
import "./createPost.css";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";

function CreatePost() {
  const [image, setImage] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [body, setBody] = useState("");
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (qrCodeUrl) {
      // Create a download link for the QR code
      const qrCodeCanvas = document.querySelector("canvas");
      qrCodeCanvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.png";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        // Send the QR code URL to the backend
        sendQRCodeUrlToBackend(qrCodeUrl);

        // Navigate to the '/Read' page
        navigate("/Read");
      });
    }
  }, [qrCodeUrl, navigate]);

  const sendQRCodeUrlToBackend = (qrCodeUrl) => {
    // Make a POST request to your backend API with the qrCodeUrl\
  
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handlePost = () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    // Perform the image upload to Cloudinary (replace with your logic)
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud2");

    fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.url) {
          setCloudinaryUrl(data.url);
          const img=data.url;
          fetch("http://localhost:5000/api/post-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ img }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                console.log("QR code URL sent to the backend successfully");
              } else {
                console.error("Error sending QR code URL to the backend:", data.error);
              }
            })
            .catch((error) => {
              console.error("Error sending QR code URL to the backend:", error);
            });
          // Generate the QR code URL from the Cloudinary URL
          const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${data.url}&size=150x150`;
          setQRCodeUrl(qrCodeDataUrl);
        }
      })
      .catch((error) => {
        console.error("Error uploading image to Cloudinary:", error);
      });
  };

  return (
    <div className="createPost">
      <h4>Create New Post</h4>
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {cloudinaryUrl && <img src={cloudinaryUrl} alt="Uploaded" />}
        <textarea
          placeholder="Write a caption...."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button onClick={handlePost}>Share</button>
        {qrCodeUrl && (
          <div>
            <QRCode value={cloudinaryUrl} size={150} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
