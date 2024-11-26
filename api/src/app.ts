import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connect_db from './config/db';
import router from './routes/Router';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import create_baseAdmin from './scripts/create_baseAdmin';
configDotenv();

const PORT = process.env.API_PORT || 3001;
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://stellar.cwtsh.site', 'https://stellar.ljit.com.br'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

connect_db();

create_baseAdmin();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});