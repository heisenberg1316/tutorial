// index.js
import express from 'express';
import cors from "cors";

const app = express();
app.use(cors());

app.get('/notifications', (req, res) => {
  console.log("hello");
  const data = {
    network: Math.floor(Math.random() * 10),         // random 0-9
    jobs: Math.floor(Math.random() * 10),
    notifications: Math.floor(Math.random() * 10),
    messaging: Math.floor(Math.random() * 10)
  };
  res.json(data);
});


app.listen(3000, () => console.log('Server running on port 3000'));
