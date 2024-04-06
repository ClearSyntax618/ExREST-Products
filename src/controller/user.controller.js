import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { pool } from '../config/db.config.js';

let response = {
    status: '',
    name: '',
    email: '',
}

const signUp = async (req, res) => {
    // Get {name, email, password} from req.body.
    const { name, email, password } = req.body;
    // Create a empty products array.
    // const products = []; // Study DB relationship...
    // Set a created_at field.
    const created_at = new Date();

    try {
        // Validate name, email & password fields.
        if(name.trim() === '' || email.trim() === '' || password.trim() === '') {
            return res.status(400).json({
                message: 'Invalid field params.'
            })
        }


        // Check if there is a user registered with same email.
        const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if(rows[0]) {
            return res.status(409).json({message: "Email already registered."});
        }

        
        // Create a jsonwebtoken.
        const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: 60*60});

        // Encrypt password.
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Save {name, email, password, created_at, products} fields in database.
        await pool.query("INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4)", [name, email, hashedPassword, created_at]);

        // Save data in response object
        response = {
            status: 'Signed up',
            name,
            email,
        }

        // Return a res.redirect('/profile')
        // res.status(201).cookie("jwt", token).cookie("user", response);
        return res.redirect(303, `/log-in`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}

const logIn = async (req, res) => {
    // Get {email, password} from req.body.
    const { email, password } = req.body;

    try {
        if(email.trim() === '' || password.trim() === '') {
            return res.status(400).json({
                message: 'Invalid field params.'
            })
        }

        // Validate if user exists in DB.
        const { rows: user } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(!user[0]) {
            return res.status(404).json({message: "User not found."});
        }

        // Compare hashed password with password.
        const confirmPassword = bcrypt.compareSync(password, user[0].password);
        // If passwords are equals then redirect to '/profile'
        if(!confirmPassword) {
            return res.status(409).json({
                message: "Invalid password."
            });
        }
        
        const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: 60*60});

        response = {
            id: user[0].id,
            status: 'Logged in',
            name: user[0].name,
            email: user[0].email,
        }
        
        res.status(201).cookie("jwt", token).cookie("user", response);
        return res.redirect(303, `/profile/${user[0].name}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error."})
    }
}


export {
    signUp,
    logIn,
}