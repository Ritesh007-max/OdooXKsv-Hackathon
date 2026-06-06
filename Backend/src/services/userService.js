const { User } = require("../models");

function getUsers() {
  return User.find().select("-password").sort({ createdAt: -1 }).lean();
}

module.exports = {
  getUsers,
};
