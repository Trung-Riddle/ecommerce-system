const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
};

exports.generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

exports.generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};