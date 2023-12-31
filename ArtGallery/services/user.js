const User = require('../models/User');

async function createUser(username,address, hashedPassword) {
    const user = new User({
        username,
        address,
        hashedPassword,
      });

    user.save();
    return user;
}

async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({ username: { $regex: pattern } });
    return user;
}

  
  async function findById(id) {
    return User.findById(id);
  }

module.exports = {
    createUser,
    getUserByUsername,
    findById
}