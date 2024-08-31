import express from 'express';
import userRoutes from './routes/user.route.js';


// const mysql = require('mysql');

// db = mysql.createConnection({
//   host: 'localhost',
//   database: 'stockin',
//   user: 'root',
//   password: ''
// });

// db.connect(err => {
//   if (err) {
//     console.error('Error when connecting to database');
//   } else {
//     console.log('Successful connection')
//   }
// });

// module.exports = {
//   db
// };

const app = express();

app.listen(3000, () => {
  console.log("Server listening on port http://localhost:3000")
});

app.use("/api/user", userRoutes);