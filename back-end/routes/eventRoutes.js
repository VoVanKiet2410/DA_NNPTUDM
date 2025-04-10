const express = require("express");
const router = express.Router();
const eventController = require("../controllers/EventController");

// Lấy tất cả sự kiện
router.get("/", eventController.getAllEvents);

// Tìm kiếm sự kiện
router.get("/search", eventController.searchEvents);

// Lấy các sự kiện sắp diễn ra
router.get("/upcoming", eventController.getUpcomingEvents);

// Lấy sự kiện theo đơn vị hiến máu
router.get(
  "/donation-unit/:donationUnitId",
  eventController.getEventsByDonationUnit
);

// Lấy một sự kiện theo ID
router.get("/:id", eventController.getEventById);

// Tạo sự kiện mới
router.post("/", eventController.createEvent);

// Cập nhật sự kiện
router.put("/:id", eventController.updateEvent);

// Xóa sự kiện
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
