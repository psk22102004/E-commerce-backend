import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnect from './db.js';
import AuthRoutes from "./routes/AuthRoutes.js"
import ProductRoutes from "./routes/ProductRoutes.js"
import CartRoutes from "./routes/CartRoutes.js"

//configure env variables
dotenv.config();

//connect to the database first
dbConnect();


const app = express();

//middlewares
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://e-commerce-frontend2.vercel.app' // Replace with your frontend production URL
      : 'http://localhost:3000', // Local development frontend URL
    credentials: true, // Allow cookies to be sent with cross-origin requests
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());
app.use(cookieParser());


app.use('/api/auth' , AuthRoutes);
app.use('/api/product',ProductRoutes);
app.use('/api/cart', CartRoutes);

app.listen('3001' , ()=>{
    console.log("Server running on port 3001")
})