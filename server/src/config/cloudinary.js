const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // cloud name
  api_key: process.env.API_KEY,       // API key
  api_secret: process.env.API_SECRET   // API secret
});

module.exports = cloudinary;