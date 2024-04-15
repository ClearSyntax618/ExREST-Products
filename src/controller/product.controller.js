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
    const {rows: products} = await pool.query("SELECT products.id, title, description, price, name FROM products INNER JOIN users ON products.user_id = users.id");
    const { user } = req.cookies;

    if(!user) {
        res.render('products/products-list', {products})
    } else {
        const {name} = user;
        res.render('products/products-list', {name, products})
    }
}

const productById = async (req, res) => {
    // Get a product by id param.
    const { id } = req.params;

    const {rows: products} = await pool.query("SELECT title, description, price, name FROM products INNER JOIN users ON products.user_id = users.id AND products.id = $1", [id]);

    const product = products[0];

    if(!product) {
        return res.status(404).send("Product is not found");
    }

    // Show their attributes
    res.render('products/product-list', {product})
}

export {
    addProduct,


    products,
    productById
}