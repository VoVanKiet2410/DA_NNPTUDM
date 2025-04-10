const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Không có quyền truy cập",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          code: 401,
          message: "Người dùng không tồn tại",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        code: 401,
        message: "Token không hợp lệ",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: "Không có quyền truy cập",
      });
    }
    next();
  };
};
