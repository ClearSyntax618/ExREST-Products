import { Router } from 'express';
import passport from 'passport';
import { isAuth } from '../auth/auth.passport.js';

import {
    signUp,
    logIn,
} from '../controller/user.controller.js';


const router = Router();

// POST
router.post('/sign-up', signUp);
router.post('/log-in', logIn);

// GET
router.get('/profile/:name', passport.authenticate('jwt', {session: false, failureRedirect: '/log-in'}), (req, res) => {
    const { id } = req.params;
    const { user: {name, email, status} } = req.cookies;
    res.render('users/profile', {id, name, email, status});
});
router.get('/log-in', isAuth, (req, res) => {
    res.render('users/log-in');
});
router.get('/sign-up', isAuth, (req, res) => {
    res.render('users/sign-up');
});


router.get('/log-out', (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("user");
    res.redirect('/log-in');

    res.end();
});

// By default
router.all('/', (req, res) => {
    res.redirect('/products')
});


export { router as userRouter }