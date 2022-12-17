import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';

import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('common'));
}

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
// @todo refactor into the appropriate routes file.
app.post('/auth/register', upload.single('picture'), register);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 60001;
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Connected to database. Listening on port ${PORT}...`)
        );
    })
    .catch((error) => console.log(`Did not connect: ${error}`));
