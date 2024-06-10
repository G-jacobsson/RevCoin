import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
