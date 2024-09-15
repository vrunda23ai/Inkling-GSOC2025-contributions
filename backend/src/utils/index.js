const { generateTokenAndSetCookie, verifyToken } = require('./jwt.js');
const { hashPassword, comparePassword} = require('./hash.js');

module.exports = {
  generateTokenAndSetCookie,
  verifyToken,
  hashPassword,
  comparePassword,
};