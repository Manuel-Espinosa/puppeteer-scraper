import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { searchRoute } from './interface_adapters/routes.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post('/search', searchRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});