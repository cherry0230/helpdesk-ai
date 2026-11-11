import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

//Helper : create a token that proves who the use is

const createToken = (userId) => {
    return jwt.sign({ id: userId}, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//REGISTER -> POST 
router.post('/register', async (req,res) => {
    try {
        const { name, email, password } = req.body;

        //dont allow duplicate emails
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use'});

        //Scramble the password before saving 
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});

        //Create a token for the user
            const token = createToken(user._id);
            res.status(201).json({
                token,
                user: { id: user._id, name: user.name, email: user.email },
    });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});


// LOGIN → POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare the typed password with the stored hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
