const User = require("../models/User");
const UserInfo = require("../schemas/UserInfo");
const ApiResponse = require("../utils/ApiResponse"); // Utility for consistent API responses

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    console.log("Received registration data:", req.body);

    // Tạo userInfo trước
    const userInfoData = req.body.userInfo;
    const userInfo = new UserInfo(userInfoData);
    await userInfo.save();

    // Tìm role mặc định (USER)
    const role = await Role.findOne({ name: "USER" });
    if (!role) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Role USER không tồn tại"));
    }

    // Tạo user với reference đến userInfo
    const userData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      userInfo: userInfo._id,
      role: role._id,
    };

    const user = new User(userData);
    await user.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, "Đăng ký thành công", { username: user.username })
      );
  } catch (error) {
    console.error("Register error:", error);

    // Xử lý lỗi trùng username
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res.status(400).json(new ApiResponse(400, "CCCD đã được đăng ký"));
    }

    res.status(500).json(new ApiResponse(500, "Lỗi đăng ký: " + error.message));
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate("role");

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Thông tin đăng nhập không chính xác"));
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json(
      new ApiResponse(200, "Đăng nhập thành công", {
        token,
        username: user.username,
        role: user.role.name,
      })
    );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Lỗi đăng nhập", error.message));
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Đang lấy danh sách người dùng...");
    const users = await User.find().select("-password");
    console.log(`Tìm thấy ${users.length} người dùng`);

    // Tạo danh sách người dùng với định dạng phù hợp
    const userList = users.map((user) => ({
      username: user.cccd,
      userInfoDTO: {
        fullName:
          user.fullName || (user.userInfo ? user.userInfo.fullName : ""),
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        sex: user.sex,
        address: user.address,
      },
      role: {
        name: user.role,
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }));

    res.status(200).json({
      success: true,
      userList: userList,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách người dùng",
      error: error.message,
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`Đang tìm người dùng với username: ${username}`);

    // Sửa lỗi tìm người dùng theo cccd hoặc username
    const user = await User.findOne({
      $or: [{ cccd: username }, { username: username }],
    }).select("-password");

    if (!user) {
      console.log(`Không tìm thấy người dùng với username: ${username}`);
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    console.log(`Đã tìm thấy người dùng: ${user.fullName}`);

    // Định dạng dữ liệu phản hồi
    const userProfile = {
      username: user.cccd || user.username,
      userInfoDTO: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        sex: user.sex,
        address: user.address,
      },
      role: {
        name: user.role,
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.status(200).json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin người dùng",
      error: error.message,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const userData = req.body;
    const user = await User.findOneAndUpdate({ username }, userData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully", user));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Error updating user", error.message));
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { username } = req.params;
    const { role } = req.body;

    // Kiểm tra role có hợp lệ không
    const validRoles = ["user", "admin", "manager", "donor", "staff"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ",
      });
    }

    const user = await User.findOne({ cccd: username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Chỉ cập nhật trường role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật vai trò thành công",
      user: {
        username: user.cccd,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật vai trò người dùng",
      error: error.message,
    });
  }
};

// Kích hoạt/Vô hiệu hóa tài khoản
exports.toggleUserStatus = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ cccd: username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Đảo ngược trạng thái kích hoạt
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Tài khoản đã được ${
        user.isActive ? "kích hoạt" : "vô hiệu hóa"
      } thành công`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể thay đổi trạng thái người dùng",
      error: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOneAndDelete({ cccd: username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa người dùng",
      error: error.message,
    });
  }
};

// Tìm kiếm người dùng
exports.searchUsers = async (req, res) => {
  try {
    const { keyword, role } = req.query;
    const query = {};

    // Tìm kiếm theo từ khóa (cccd hoặc fullName)
    if (keyword) {
      query.$or = [
        { cccd: { $regex: keyword, $options: "i" } },
        { fullName: { $regex: keyword, $options: "i" } },
      ];
    }

    // Lọc theo vai trò
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select("-password");

    // Định dạng dữ liệu phản hồi
    const userList = users.map((user) => ({
      username: user.cccd,
      userInfoDTO: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        sex: user.sex,
        address: user.address,
      },
      role: {
        name: user.role,
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: userList.length,
      userList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tìm kiếm người dùng",
      error: error.message,
    });
  }
};
