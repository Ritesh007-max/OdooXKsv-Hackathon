const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Protect routes by verifying JWT in request headers
 */
async function protect(req, res, next) {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const err = new Error("Not authorized, no token provided");
      err.status = 401;
      return next(err);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      const err = new Error("Not authorized, token validation failed");
      err.status = 401;
      return next(err);
    }

    // Get user from database using decoded ID (handle Mixed type _id)
    let queryId = decoded.id;
    const mongoose = require("mongoose");
    if (typeof queryId === "string" && mongoose.Types.ObjectId.isValid(queryId)) {
      queryId = new mongoose.Types.ObjectId(queryId);
    }

    const user = await User.findById(queryId);
    if (!user) {
      const err = new Error("Not authorized, user not found");
      err.status = 401;
      return next(err);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Restrict access to specific user roles
 * @param {...string} roles
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error("You do not have permission to perform this action");
      err.status = 403;
      return next(err);
    }
    next();
  };
}

module.exports = {
  protect,
  restrictTo,
};
