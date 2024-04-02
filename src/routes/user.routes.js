import { Router } from 'express';

import {
    signUp,
    logIn,
    userProfile
} from '../controller/user.controller.js';

import passport from 'passport';


const router = Router();

router.post('/sign-up', signUp);

router.post('/log-in', logIn);

router.get('/profile', passport.authenticate('jwt', {session: false, failureRedirect: '/log-in'}), userProfile)

export { router }