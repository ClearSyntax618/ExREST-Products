import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import hbs from 'hbs';
hbs.registerPartials(__dirname + '/views/partials');

import './auth/auth.passport.js';

import { productRouter } from './routes/product.routes.js';
import { userRouter } from './routes/user.routes.js';

const app = express();

// Setter
app.set("port", 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middlewares
app.use(morgan("dev"));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
    extended: false,
}));
app.use(express.text());
app.use(passport.initialize());

// Routes
app.use(userRouter);
app.use(productRouter);

// Running server
app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`)
});