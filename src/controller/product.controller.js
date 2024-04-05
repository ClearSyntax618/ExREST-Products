import { pool } from '../config/db.config.js';

const products = async (req, res) => {
    // Get all products from DB.
    // Show them in page.
    res.render('products-list')
}

const productById = async (req, res) => {
    // Get a product by id param.
    // Show their attributes
    const { id } = req.params;
    res.render('product-list', {id})
}

export {
    products,
    productById
}