import express from "express";
import { addToCart, decreaseQuantity, getUserCart, removeFromCart } from "../controllers/CartController.js";


const router = express.Router();

router.post('/addToCart' , addToCart); // needs userId, productId, quantity = 1 in req.body
router.post('/decreaseQuantity' , decreaseQuantity); //userId, productId in req.body
router.post('/removeFromCart',removeFromCart); //userId, productId in req.body
router.get('/getUserCart/:userId', getUserCart); // 


export default router;