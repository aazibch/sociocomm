const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const error = require('./middleware/error');

const path = require('path');

const userRoutes = require('./routes/userRoutes.js');
const postRoutes = require('./routes/postRoutes.js');

/* CONFIGURATIONS */
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
    app.use(morgan('dev'));
}

/* ROUTES */
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.all('*', (req, res, next) => {
    next(new AppError('Route not found.', 404));
});
app.use(error);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3001;
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DB.replace('<password>', process.env.DB_PASS), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Connected to database. Listening on port ${PORT}...`)
        );
    })
    .catch((error) => console.log(`Did not connect: ${error}`));
