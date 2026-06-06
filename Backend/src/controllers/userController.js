const userService = require("../services/userService");

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
};
