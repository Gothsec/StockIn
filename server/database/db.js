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

export default db;