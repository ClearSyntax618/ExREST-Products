import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

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
        return done(error, false);
    }
}));

// isAuth checker
export const isAuth = (req, res, next) => {
    const { user: {status} } = req.cookies;

    try {
        if(!status || status == undefined) {
            return next();
        } else {
            return res.redirect('/profile')
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}
