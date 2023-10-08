const express = require('express');
const router = express.Router();
const Image = require('../models/Image');

router.post("/api/post-image", async (req, res) => {
    try {
        const { img } = req.body; // Extract the 'img' field from the request body
        console.log(img)
        const newImage = new Image({ img }); // Create a new image instance
        const savedImage = await newImage.save();
        res.status(201).json({ message: "Image saved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/api/get-image", async (req, res) => {
    try {
      const { img } = req.body; // Extract the 'img' field from the request body
      console.log(img);
      
      const image = await Image.findOne( {img} );
      console.log(image);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      res.status(200).json(image);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Error' });
    }
  });
  
// router.get("/api/getImage", async (req, res) => {
//     try {
//         res.status(200).json({ message: 'success111' });
//     } catch (err) {
//         return res.status(404).json({ message: 'error' });
//     }
// });
module.exports = router;
