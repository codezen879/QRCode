const express=require('express');
const mongoose=require('mongoose');
const app=express();
const port=5000;
const cors=require('cors');
const router=express.Router();
require('dotenv').config();
app.use(express.json());
app.use(cors());
// app.get("/api/getImage", async (req, res) => {
//     try {
//         res.status(200).json({ message: 'success' });
//     } catch (err) {
//         return res.status(404).json({ message: 'error' });
//     }
// });

app.use(require("./routes/image"));
const connectionString = process.env.MONGODB_URL;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB database');
});
app.listen(port, () => {
    console.log("server is running on port" + " " + port)
})