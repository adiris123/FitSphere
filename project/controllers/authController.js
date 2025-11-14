const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const config = require('../config/env');

const generateToken = (user) =>
  jwt.sign({ user_id: user.user_id, role: user.role, email: user.email }, config.jwtSecret, {
    expiresIn: '12h',
  });

const signup = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ name, email, password: hashedPassword, role });
    const token = generateToken(user);

    return res.status(201).json({
      message: 'Signup successful',
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const { password: omitted, ...safeUser } = user;

    return res.json({
      message: 'Login successful',
      user: safeUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.user_id);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load profile', error: error.message });
  }
};

module.exports = {
  signup,
  login,
  me,
};
