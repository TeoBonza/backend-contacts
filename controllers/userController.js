const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppDataSource = require('../dataSource');

//@desc Register a user
//@route POST /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  };

  // Check if user already exists
  const userRepository = AppDataSource.getMongoRepository(User);
  const userExists = await userRepository.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already registered');
  };

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userRepository.create({
    username,
    email,
    password: hashedPassword,
  });

  const user = await userRepository.save(newUser);

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error('User data is not valid');
  };
});

//@desc Login user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  };

  // Check if user exists
  const userRepository = AppDataSource.getMongoRepository(User);
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  };

  // Compare password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const accessToken = jwt.sign({
      user: {
        username: user.username,
        email: user.email,
        id: user.id.toString(),
      },
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error('Email or password is invalid');
  };

  res.status(200).json(user);
});

//@desc Current user info
//@route GET /api/users/current
//@access Private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};