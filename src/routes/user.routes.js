import { Router } from 'express';

import {
    signUp,
    logIn,
} from '../controller/user.controller.js';

import { isAuth } from '../auth/auth.passport.js';

import passport from 'passport';

const router = Router();

// POST
router.post('/sign-up', signUp);
router.post('/log-in', logIn);

// GET
router.get('/profile', passport.authenticate('jwt', {session: false, failureRedirect: '/log-in'}), (req, res) => {
    const { user: {name, email, status} } = req.cookies;
    res.render('index', {name, email, status});
})
router.get('/log-in', isAuth, (req, res) => {
    res.render('log-in');
});
router.get('/sign-up', isAuth, (req, res) => {
    res.render('sign-up');
});


router.get('/log-out', (req, res) => {
    res.clearCookie("user");
    res.redirect('/log-in');
    res.end();
})


export { router }