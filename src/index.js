import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';


import './auth/auth.passport.js';

import { router } from './routes/user.routes.js';

const app = express();

// Setter
app.set("port", 3000);

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
app.use(router);

// Running server
app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`)
});