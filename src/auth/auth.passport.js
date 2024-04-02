import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import jwt from 'jsonwebtoken'

import { pool } from "../config/db.config.js";

const cookieExtractor = (req) => {
    const { jwt: token } = req.cookies;
    
    return token;
}

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.SECRET_KEY,
}, async ({email}, done) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.log(error);
        return done(err, false);
    }
}));
