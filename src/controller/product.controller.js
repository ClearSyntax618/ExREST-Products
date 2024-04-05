import e from 'express';
import { pool } from '../config/db.config.js';

// POST
const addProduct = async (req, res) => {
    const { user: {id} } = req.cookies;
    const {title, description, price} = req.body;
    const created_at = new Date();

    try {
        // Check fields.
        if(title.trim() === '' || description.trim() === '' || price.trim() === '') {
            return res.status(400).json({
                message: 'Fields are empty'
            })
        }

        // Save new product
        await pool.query("INSERT INTO products (title, description, price, created_at, user_id) VALUES ($1, $2, $3, $4, $5)", [title, description, price, created_at, id]);

        return res.redirect(303, `/products`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


// GET
const products = async (req, res) => {
    // Get all products from DB.
    const {rows: products} = await pool.query("SELECT title, description, price, name FROM products INNER JOIN users ON products.user_id = users.id");

    // Show them in page.
    console.log(products);
    res.render('products/products-list', products)
}

const productById = async (req, res) => {
    // Get a product by id param.
    // const {rows: products} = await pool.query("SELECT title, description, price, name FROM products INNER JOIN users ON products.user_id = users.id");

    // Show their attributes
    const { id } = req.params;
    res.render('products/product-list', {id})
}

export {
    addProduct,


    products,
    productById
}