const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authController = require('../controllers/authController');

// Phải có route này
router.post('/login', authController.login);
// Lấy danh sách người dùng
router.get("/", UserController.getAllUsers);

// Tìm kiếm người dùng
router.get("/search", UserController.searchUsers);

// Lấy thông tin người dùng theo username (cccd)
router.get("/:username", UserController.getUserProfile);

// Cập nhật vai trò người dùng
router.patch("/:username/role", UserController.updateUserRole);

// Kích hoạt/Vô hiệu hóa tài khoản người dùng
router.patch("/:username/status", UserController.toggleUserStatus);

// Xóa người dùng
router.delete("/:username", UserController.deleteUser);

module.exports = router;
