const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

/**
 * Registers a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @returns {Promise<{user: object, token: string}>}
 */
async function register(name, email, password, role) {
  if (!name || !email || !password) {
    const err = new Error("Please provide name, email, and password");
    err.status = 400;
    throw err;
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("Email already registered");
    err.status = 400;
    throw err;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate a custom MongoDB ObjectId since schema uses Mixed _id
  const _id = new mongoose.Types.ObjectId();

  // Validate and format role
  const allowedRoles = ["admin", "officer", "manager", "vendor"];
  const userRole = allowedRoles.includes(role) ? role : "vendor";

  // Create new user
  const user = new User({
    _id,
    name,
    email,
    password: hashedPassword,
    role: userRole,
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  // Prepare user object for response
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
}

/**
 * Log in an existing user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
async function login(email, password) {
  if (!email || !password) {
    const err = new Error("Please provide email and password");
    err.status = 400;
    throw err;
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  // Prepare user object for response
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
}

/**
 * Gets a user's details by their ID
 * @param {string|object} userId
 * @returns {Promise<object>}
 */
async function getCurrentUser(userId) {
  let queryId = userId;
  if (typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)) {
    queryId = new mongoose.Types.ObjectId(userId);
  }
  const user = await User.findById(queryId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
