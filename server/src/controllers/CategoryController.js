const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

const createParentCategory = asyncHandler(async (req, res) => {
  const { name, code, parentCategory } = req.body;
  const image = req.file ? req.file.path : "";
  const existingCategory = await Category.findOne({ code });

  if (existingCategory) {
    cloudinary.uploader.destroy(req.file.filename, function (error, result) {
      if (error) {
        console.log("Error deleting file from Cloudinary: ", error);
      } else {
        console.log("File deleted successfully from Cloudinary: ", result);
      }
    });
    return res.status(400).json({
      message: "Tên danh mục đã tồn tại",
    });
  }
  const category = await Category.create({
    name,
    code,
    image,
    parentCategory: parentCategory || null
  });
  return res.status(201).json({
    message: "Successfully",
    category,
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
    const data = await Category.find()
    return res.json({
        categories: data || []
    })
})

module.exports = {
  createParentCategory,
  getAllCategories
};
