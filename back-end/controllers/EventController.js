const Event = require("../schemas/Event");
const DonationUnit = require("../schemas/DonationUnit");
const ApiResponse = require("../utils/ApiResponse");

// Lấy tất cả sự kiện
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("donationUnit", "name unitPhotoUrl")
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách sự kiện",
      error: error.message,
    });
  }
};

// Lấy một sự kiện theo ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "donationUnit",
      "name unitPhotoUrl"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin sự kiện",
      error: error.message,
    });
  }
};

// Tạo sự kiện mới
exports.createEvent = async (req, res) => {
  try {
    // Kiểm tra đơn vị hiến máu có tồn tại
    const donationUnit = await DonationUnit.findById(req.body.donationUnit);
    if (!donationUnit) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn vị hiến máu",
      });
    }

    // Kiểm tra thời gian kết thúc > thời gian bắt đầu
    const startTime = new Date(`1970-01-01T${req.body.eventStartTime}`);
    const endTime = new Date(`1970-01-01T${req.body.eventEndTime}`);
    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
    }

    const event = new Event(req.body);
    await event.save();

    // Cập nhật mảng events trong DonationUnit
    await DonationUnit.findByIdAndUpdate(
      req.body.donationUnit,
      { $push: { events: event._id } },
      { new: true }
    );

    const populatedEvent = await Event.findById(event._id).populate(
      "donationUnit",
      "name unitPhotoUrl"
    );

    res.status(201).json({
      success: true,
      message: "Tạo sự kiện thành công",
      data: populatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tạo sự kiện",
      error: error.message,
    });
  }
};

// Cập nhật sự kiện
exports.updateEvent = async (req, res) => {
  try {
    if (req.body.donationUnit) {
      const donationUnit = await DonationUnit.findById(req.body.donationUnit);
      if (!donationUnit) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn vị hiến máu",
        });
      }
    }

    if (req.body.eventStartTime && req.body.eventEndTime) {
      const startTime = new Date(`1970-01-01T${req.body.eventStartTime}`);
      const endTime = new Date(`1970-01-01T${req.body.eventEndTime}`);
      if (endTime <= startTime) {
        return res.status(400).json({
          success: false,
          message: "Thời gian kết thúc phải sau thời gian bắt đầu",
        });
      }
    }

    // Kiểm tra sự kiện có tồn tại không
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Nếu đơn vị hiến máu thay đổi, cập nhật mảng events trong DonationUnit
    if (
      req.body.donationUnit &&
      req.body.donationUnit !== existingEvent.donationUnit.toString()
    ) {
      // Xóa event khỏi đơn vị cũ
      await DonationUnit.findByIdAndUpdate(existingEvent.donationUnit, {
        $pull: { events: existingEvent._id },
      });

      // Thêm event vào đơn vị mới
      await DonationUnit.findByIdAndUpdate(req.body.donationUnit, {
        $push: { events: existingEvent._id },
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("donationUnit", "name unitPhotoUrl");

    res.status(200).json({
      success: true,
      message: "Cập nhật sự kiện thành công",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật sự kiện",
      error: error.message,
    });
  }
};

// Xóa sự kiện
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Kiểm tra xem sự kiện đã có người đăng ký chưa
    if (event.currentRegistrations > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa sự kiện đã có người đăng ký",
      });
    }

    // Xóa reference trong DonationUnit
    await DonationUnit.findByIdAndUpdate(event.donationUnit, {
      $pull: { events: event._id },
    });

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Xóa sự kiện thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa sự kiện",
      error: error.message,
    });
  }
};

// Lấy sự kiện theo đơn vị hiến máu
exports.getEventsByDonationUnit = async (req, res) => {
  try {
    const events = await Event.find({ donationUnit: req.params.donationUnitId })
      .populate("donationUnit", "name unitPhotoUrl")
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách sự kiện theo đơn vị",
      error: error.message,
    });
  }
};

// Lấy các sự kiện sắp diễn ra
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      eventDate: { $gte: new Date() },
      status: "ACTIVE",
    })
      .populate("donationUnit", "name unitPhotoUrl")
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách sự kiện sắp diễn ra",
      error: error.message,
    });
  }
};

// Tìm kiếm sự kiện
exports.searchEvents = async (req, res) => {
  try {
    const { keyword, status, date, unitId } = req.query;
    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const searchDate = new Date(date);
      query.eventDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lte: new Date(searchDate.setHours(23, 59, 59, 999)),
      };
    }

    if (unitId) {
      query.donationUnit = unitId;
    }

    const events = await Event.find(query)
      .populate("donationUnit", "name unitPhotoUrl")
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tìm kiếm sự kiện",
      error: error.message,
    });
  }
};
