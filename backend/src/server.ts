import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import { connectDB } from './config/db';


const app = express();

// Connect to the DB 
connectDB();

const PORT = process.env.PORT;


app.get('/', (req, res) => {
  res.send('Server ready')
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
