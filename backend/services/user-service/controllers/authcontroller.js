const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email ,boards:user.boardIds } });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email ,boards:user.boardIds} });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};



exports.getUser = async (req, res) => {
const { userId, email } = req.query;

    const query = {};
    if (userId) query._id = userId;
    if (email) query.email = email;

  try {
       if (Object.keys(query).length === 0) {
      return res.status(400).json({ message: "No valid query parameters provided" });
    }
    const user = await User.findOne( query ).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
      console.error('Error getting user info:', err);
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};


exports.addBoardToUser = async (req, res) => {
  const { userId, email, boardId } = req.body;

  if (!boardId || (!userId && !email)) {
    return res.status(400).json({ error: 'Missing boardId and user identifier (userId or email)' });
  }

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    return res.status(400).json({ error: 'Invalid boardId format' });
  }

  try {
    const query = userId ? { _id: userId } : { email };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const boardObjectId = new mongoose.Types.ObjectId(boardId);

    if (!user.boardIds.some(id => id.equals(boardObjectId))) {
      user.boardIds.push(boardObjectId);
      await user.save();
    }

    res.status(200).json({ message: 'Board ID added', boardIds: user.boardIds });
  } catch (err) {
    console.error('Error updating user boardIds:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


