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
  origin: (origin, callback) => {
      const allowedOrigins = [
          'http://localhost:3000', // Local development
          'https://e-commerce-frontend2.vercel.app', // Production
      ];
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow the request
      } else {
          callback(new Error('Not allowed by CORS')); // Block the request
      }
  },
  credentials: true,
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