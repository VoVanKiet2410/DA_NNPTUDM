const mongoose = require("mongoose");

const donationUnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    }],
  },
  {
    timestamps: true,
  }
);

// Thêm index để tối ưu tìm kiếm
donationUnitSchema.index({ name: "text", address: "text" });
donationUnitSchema.index({ status: 1 });

const DonationUnit = mongoose.model("DonationUnit", donationUnitSchema);

module.exports = DonationUnit;