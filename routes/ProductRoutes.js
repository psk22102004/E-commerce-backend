import express from "express";
import { createProduct, deleteProduct, getCategories, getProduct, getProducts, updateProduct } from "../controllers/ProductController.js";
//import the controller functions here

const router = express.Router();

router.post('/createProduct' , createProduct); //name, description , price, category , images , stock in req.body
router.get('/getProducts' , getProducts); // page = 1 , limit = 10 , category , minPrice , maxPrice in url query i.e. after ?
router.get('/getProduct/:productId' , getProduct);
router.put('/updateProduct/:_id' , updateProduct); // _id from url params
router.delete('/deleteProduct/:_id' , deleteProduct); // _id from url params
router.get('/categories', getCategories);


export default router;