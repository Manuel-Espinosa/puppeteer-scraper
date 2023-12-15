import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { searchRoute,getSpecs,getCompare } from './interface_adapters/routes.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post('/search', searchRoute);
app.post('/product/specs', getSpecs);
app.post('/products/compare', getCompare);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});