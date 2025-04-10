const express = require("express");
const router = express.Router();
const donationUnitController = require("../controllers/DonationUnitController");

// GET /api/donation-units - Lấy danh sách đơn vị
router.get("/", donationUnitController.getAllUnits);

// GET /api/donation-units/:id - Lấy chi tiết một đơn vị
router.get("/:id", donationUnitController.getUnitById);

// POST /api/donation-units - Tạo đơn vị mới
router.post("/", donationUnitController.createUnit);

// PUT /api/donation-units/:id - Cập nhật đơn vị
router.put("/:id", donationUnitController.updateUnit);

// DELETE /api/donation-units/:id - Xóa đơn vị
router.delete("/:id", donationUnitController.deleteUnit);

module.exports = router;
