import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connect_db from './config/db';
import router from './routes/Router';
import cookieParser from 'cookie-parser';


const PORT = process.env.API_PORT || 3001;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

connect_db();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});