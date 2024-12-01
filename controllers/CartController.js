import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

//create a new cart when user logins

// Add new product to cart or increase quantity
export const addToCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock!" });
    }

    // Check if user already has a cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product is already in the cart
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      //findIndex function returns -1 if product not foubcd

      if (itemIndex !== -1) {
        // Product exists, update quantity
        if (product.stock - quantity >= 0) {
          const newQuantity = cart.items[itemIndex].quantity + quantity;
          cart.items[itemIndex].quantity = newQuantity;
          await cart.save();
          // Reduce product stock
          product.stock -= quantity;
          await product.save();
          return res.json({ cart, message: "Product successfully added to the cart!" });

        }
      } else {
        // Product not in cart, add it
        cart.items.push({ productId, quantity });
      }

      // Save updated cart
      await cart.save();
    } else {
      // No cart exists, create a new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
      await cart.save();
    }

    // Reduce product stock
    product.stock -= quantity;
    await product.save();

    res.json({ cart, message: "Product successfully added to the cart!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error adding items to the cart!" });
  }
};

export const decreaseQuantity = async (req, res) => {
  const { userId, productId } = req.body;
  const product = await Product.findById(productId);


  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product index in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // If quantity is more than 1, decrease it
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        // Remove the product if quantity is 1
        cart.items.splice(itemIndex, 1);
      }

      product.stock = product.stock + 1;
      await product.save();

      // Save the updated cart
      await cart.save();

      // Return the updated cart
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error decreasing quantity" });
  }
};


// Remove product completely from cart


export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (cart) {
      // Find the product in the cart and get the quantity
      const productInCart = cart.items.find(item => item.productId.toString() === productId);
      if (!productInCart) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Get the quantity of the product in the cart
      const productQuantityInCart = productInCart.quantity;

      // Remove the product from the cart
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();

      // Update the product stock by adding back the quantity removed from the cart
      const product = await Product.findById(productId);
      if (product) {
        product.stock += productQuantityInCart; // Restock the product
        await product.save();
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ cart, message: 'Product was removed from the cart successfully and restocked' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to remove product from cart' });
  }
};


//get user cart
export const getUserCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId')
    //here populate function means instead of productId , fetch the actual documents
    res.json({ cart, message: "cart fetched successfully !" } || { message: "Cart is empty !" })
  } catch (error) {
    return res.json({ error: "error fetching the cart !" })
  }
}