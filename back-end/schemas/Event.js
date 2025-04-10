const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sự kiện là bắt buộc"],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, "Ngày diễn ra là bắt buộc"],
      validate: {
        validator: function (v) {
          return v >= new Date();
        },
        message: "Ngày diễn ra phải lớn hơn hoặc bằng ngày hiện tại",
      },
    },
    eventStartTime: {
      type: String,
      required: [true, "Thời gian bắt đầu là bắt buộc"],
      match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        "Thời gian không hợp lệ",
      ],
    },
    eventEndTime: {
      type: String,
      required: [true, "Thời gian kết thúc là bắt buộc"],
      match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        "Thời gian không hợp lệ",
      ],
    },
    location: {
      type: String,
      required: [true, "Địa điểm là bắt buộc"],
      trim: true,
    },
    maxRegistrations: {
      type: Number,
      required: [true, "Số lượng đăng ký tối đa là bắt buộc"],
      min: [1, "Số lượng đăng ký tối đa phải lớn hơn 0"],
    },
    currentRegistrations: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (v) {
          return v <= this.maxRegistrations;
        },
        message: "Số lượng đăng ký hiện tại không thể vượt quá số lượng tối đa",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["DONE", "ACTIVE", "FULL"],
        message: "{VALUE} không phải là trạng thái hợp lệ",
      },
      default: "ACTIVE",
    },
    donationUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationUnit",
      required: [true, "Đơn vị hiến máu là bắt buộc"],
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware để tự động cập nhật trạng thái
EventSchema.pre("save", function (next) {
  if (this.currentRegistrations >= this.maxRegistrations) {
    this.status = "FULL";
  }
  next();
});

// Virtual để kiểm tra xem sự kiện có thể đăng ký không
EventSchema.virtual("isRegisterable").get(function () {
  return (
    this.status === "ACTIVE" &&
    this.currentRegistrations < this.maxRegistrations
  );
});

// Indexes
EventSchema.index({ name: "text", location: "text" });
EventSchema.index({ donationUnit: 1 });
EventSchema.index({ eventDate: 1 });
EventSchema.index({ status: 1 });

module.exports = mongoose.model("Event", EventSchema);
