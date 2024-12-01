// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Generate JWT
const generateToken = (user) => { //user document is sent
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
};

//res.cookie('token' , token , {options}) used to store data in cookie
//req.cookies.token is used to extract the token from the cookie

// Signup function
export const signup = async (req, res) => {
  const { username , password, role = 'user' } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    await user.save();

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: false,  // Cookie is not accessible via JavaScript (security best practice)
      secure: process.env.NODE_ENV === 'production', // Set to true for HTTPS in production
      sameSite: 'None', // Must be 'None' for cross-origin requests
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'User registered successfully', role: user.role });
  } catch (error) {
    res.json({ error: 'Error registering user' });
  }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.json({ error: 'Invalid username or password' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.json({ error: 'Invalid email or password' });
  
      const token = generateToken(user);
  
      res.cookie('token', token, {
        httpOnly: false,  // Cookie is not accessible via JavaScript (security best practice)
      secure: process.env.NODE_ENV === 'production', // Set to true for HTTPS in production
      sameSite: 'None', // Must be 'None' for cross-origin requests
      maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.json({ message: 'Logged in successfully', role: user.role });
    } catch (error) {
      res.json({ error: 'Error logging in' });
    }
  };
  
  export const verify = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ error: 'Not authorized' });
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      res.json({ id: decoded.id, role: decoded.role });
    } catch (error) {
      res.json({ error: 'Token invalid or expired' });
    }
  };
  
  export const logout = (req, res) => {
    try {
      // Clear the token from cookies
      res.clearCookie('token', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production', // Uncomment in production
      });
  
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.json({ error: 'Error logging out' });
    }
  };
  