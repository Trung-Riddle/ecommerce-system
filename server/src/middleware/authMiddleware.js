const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  if (req.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          Unauthorized: true
        });
      req.user = decode;
      next();
    });
  } else
    return res.status(401).json({
      success: false,
      Unauthorized: true
    });
};
exports.isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin') {
    const error = new Error('Yêu cầu quyền admin!');
    error.statusCode = 403
    return next(error)
  }
  next();
};

exports.isSeller = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'seller' && role !== 'admin') {
    const error = new Error('Yêu cầu quyền seller hoặc admin!');
    error.statusCode = 403
    return next(error)
  }
  next();
};
