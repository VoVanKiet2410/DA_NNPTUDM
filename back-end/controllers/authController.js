const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      cccd: user.cccd,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

exports.register = async (req, res) => {
  try {
    const { cccd, password, fullName, dob, sex, address, email, phone } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ cccd }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: "CCCD hoặc email đã được sử dụng",
      });
    }

    // Create new user
    const user = new User({
      cccd,
      password,
      fullName,
      dob,
      sex,
      address,
      email,
      phone,
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      code: 200,
      message: "Đăng ký thành công",
      data: {
        token,
        user: {
          id: user._id,
          cccd: user.cccd,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { cccd, password } = req.body;

    // Find user by CCCD
    const user = await User.findOne({ cccd });

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "CCCD hoặc mật khẩu không đúng",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        code: 401,
        message: "CCCD hoặc mật khẩu không đúng",
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      data: {
        token,
        user: {
          id: user._id,
          cccd: user.cccd,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log("Getting profile for user ID:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng",
      });
    }

    console.log("User found:", user);

    res.json({
      code: 200,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
