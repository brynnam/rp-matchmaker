const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const UserManager = require('./userManager');

require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in the environment variables.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const userManager = new UserManager('./users.json');

app.post('/login', async (req, res) => {
  console.log('Login request received:', req.body); // Debug log
  const { username, password } = req.body;

  // Server-side validation: Username must start with @
  if (!username.startsWith('@')) {
    console.log('Invalid username (does not start with @):', username); // Debug log
    return res.status(400).json({ message: 'Username must start with @.' });
  }

  const user = userManager.findUserByUsername(username);

  if (!user) {
    console.log('User not found:', username); // Debug log
    return res.status(401).json({ message: 'User not found! Please sign up first!' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Invalid credentials for user:', username); // Debug log
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Login successful for user:', username); // Debug log
  res.json({ token });
});

app.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body); // Debug log
  const { username, password } = req.body;

  // Server-side validation: Username must start with @
  if (!username.startsWith('@')) {
    console.log('Invalid username (does not start with @):', username); // Debug log
    return res.status(400).json({ message: 'Username must start with @.' });
  }

  const existingUser = userManager.findUserByUsername(username);

  if (existingUser) {
    console.log('User already exists:', username); // Debug log
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };

  try {
    await userManager.addUser(newUser); // Use UserManager's addUser method
    console.log('User added successfully:', newUser); // Debug log
  } catch (err) {
    console.error('Error saving user:', err); // Debug log
    return res.status(500).json({ message: 'Internal server error' });
  }

  const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Signup successful for user:', username); // Debug log
  res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});