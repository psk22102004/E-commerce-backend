import Product from "../models/Product.js";

//create a product
export const createProduct = async (req, res) => {
    const { name, description, price, category, images, stock } = req.body;
    try {
        const product = new Product({ name, description, price, category, images, stock });
        await product.save();
        res.json({ product, message: "product created successfully !" });
    } catch (error) {
        res.json({ error: "Error creating product !" });
    }
}

//to get all unique categories of the products
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category'); // Get unique categories
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const getProduct = async(req,res)=>{
    const{productId} = req.params;
    const product = await Product.findOne({_id : productId});
    res.json({product})
}

export const getProducts = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        category,
        minPrice,
        maxPrice,
        sort,
    } = req.query;

    try {
        const filter = {
            category: category || { $exists: true },
            price: {
                $gte: minPrice ? Number(minPrice) : 0,
                $lte: maxPrice ? Number(maxPrice) : Infinity,
            },
        };

        const sortOptions = {};
        if (sort === "price_asc") sortOptions.price = 1; // Sort by price (low to high)
        if (sort === "price_desc") sortOptions.price = -1; // Sort by price (high to low)

        const totalCount = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sortOptions) // Apply sorting
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            products,
            totalCount,
            currentPage: Number(page),
            totalPages: Math.ceil(totalCount / limit),
            message: "Products with filters fetched successfully!",
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Error fetching products!" });
    }
};


// update products , take name from the request VIA PUT REQUEST
export const updateProduct = async (req, res) => {
    const { _id } = req.params; //get the _id from the :_id parameter
    const updatedDocument = req.body;
    try {
        //first find the product
        const updatedProduct = await Product.findByIdAndUpdate({ _id }, updatedDocument, { new: true }) //new : true returns the updated product 

        res.json({ updatedProduct, message: "Product updated successfullt !" })

        if (!updatedProduct) {
            return res.json({ error: "Product not found !" })
        }
    } catch (error) {
        res.json({ error: "Not able to update product !" })
    }
}

//delete a product VIA DELETE REQUEST
export const deleteProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        await Product.findByIdAndDelete(_id);
        res.json({ message: "Product deleted successfully !" })
    } catch (error) {
        res.json({ error: "Product could not be deleted !" })
    }
}