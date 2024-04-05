import { Router } from "express";
import { products, productById } from "../controller/product.controller.js";

const router = Router();

router.get('/products', products);
router.get('/product/:id', productById);

export { router as productRouter}