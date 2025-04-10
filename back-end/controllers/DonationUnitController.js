const DonationUnit = require("../schemas/DonationUnit");

// Lấy danh sách đơn vị hiến máu
exports.getAllUnits = async (req, res) => {
  try {
    const units = await DonationUnit.find();
    res.status(200).json({
      success: true,
      data: units,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn vị hiến máu",
      error: error.message,
    });
  }
};

// Lấy chi tiết một đơn vị hiến máu
exports.getUnitById = async (req, res) => {
  try {
    const unit = await DonationUnit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn vị hiến máu",
      });
    }
    res.status(200).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin đơn vị hiến máu",
      error: error.message,
    });
  }
};

// Tạo đơn vị hiến máu mới
exports.createUnit = async (req, res) => {
  try {
    const { name, location, phone, email, unitPhotoUrl } = req.body;
    const unit = await DonationUnit.create({
      name,
      location,
      phone,
      email,
      unitPhotoUrl,
    });
    res.status(201).json({
      success: true,
      message: "Tạo đơn vị hiến máu thành công",
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tạo đơn vị hiến máu",
      error: error.message,
    });
  }
};

// Cập nhật đơn vị hiến máu
exports.updateUnit = async (req, res) => {
  try {
    const { name, location, phone, email, unitPhotoUrl } = req.body;
    const unit = await DonationUnit.findByIdAndUpdate(
      req.params.id,
      {
        name,
        location,
        phone,
        email,
        unitPhotoUrl,
      },
      { new: true, runValidators: true }
    );

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn vị hiến máu",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật đơn vị hiến máu thành công",
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật đơn vị hiến máu",
      error: error.message,
    });
  }
};

// Xóa đơn vị hiến máu
exports.deleteUnit = async (req, res) => {
  try {
    const unit = await DonationUnit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn vị hiến máu",
      });
    }
    res.status(200).json({
      success: true,
      message: "Xóa đơn vị hiến máu thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa đơn vị hiến máu",
      error: error.message,
    });
  }
};
