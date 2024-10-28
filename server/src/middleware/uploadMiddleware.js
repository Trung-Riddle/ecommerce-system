const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folder = req.body.folder || "ecommerce"; // Thư mục chính
    const subfolder = req.body.subfolder || ""; // Thư mục con (nếu có)

    return {
      folder: `${folder}/${subfolder}`,
      allowed_formats: ["jpg", "jpeg", "png", "gif"], // Định dạng file cho phép
      public_id: file.originalname.split(".")[0] + "-" + Date.now(), // Tạo public_id duy nhất
    };
  },
});

const upload = multer({ storage: storage });

const checkSingleFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  next();
};

const checkMultipleFiles = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  next();
};

module.exports = { checkSingleFile, checkMultipleFiles, upload };
