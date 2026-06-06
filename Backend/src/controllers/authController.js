const authService = require("../services/authService");

/**
 * Handle user registration
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register(name, email, password, role);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handle user login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get currently authenticated user details
 */
async function getMe(req, res, next) {
  try {
    // req.user is populated by protect middleware
    if (!req.user) {
      const err = new Error("Not authorized");
      err.status = 401;
      return next(err);
    }
    const user = await authService.getCurrentUser(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};
