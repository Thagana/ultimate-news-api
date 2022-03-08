import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routers/routers';
import db from './configs/db.mongodb';
import newSaveCron from './Jobs/saveNews';

dotenv.config();

if (!process.env.PORT) {
	process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => console.log('Connect to Mongodb Database'));
db.on('disconnected', () => console.log('Database disconnected'));

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

routes(app);

newSaveCron.start();

app.listen(PORT, () => {
    console.log(`Application running successfully on ${PORT}`)
})