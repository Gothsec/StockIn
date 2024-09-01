import express from 'express';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  database: 'stockin',
  user: 'root',
  password: ''
});

db.connect(err => {
  if (err) {
    console.error('Error when connecting to database');
  } else {
    console.log('Successful connection')
  }
});

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server listening on port http://localhost:3000")
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);