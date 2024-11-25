import express from 'express';
import routes from './server/api/endPoints.js';
import 'dotenv/config';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "DELETE", "PATCH", "PUT"]
}));

app.use('/', routes);

app.listen(3000, () => {
  console.log("Server listening on port http://localhost:3000")
});