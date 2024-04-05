import { Router } from "express";
import { addProduct, products, productById } from "../controller/product.controller.js";

const router = Router();

// POST
router.post("/add-product", addProduct);


// GET
router.get('/products', products);
router.get('/product/:id', productById);

router.get('/add-product', (req, res) => {
    res.render('products/add-product');
})

export { router as productRouter}