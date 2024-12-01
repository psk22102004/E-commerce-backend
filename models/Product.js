import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    category: { type: String },
    images: [{ type: String }],
    stock: { type: Number },
    brand : {type : String},
    colour : {type : String}

});

const Product = mongoose.model("Product", productSchema);

export default Product;