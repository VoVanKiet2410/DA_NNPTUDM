const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventStartTime: {
      type: String,
      required: true,
    },
    eventEndTime: {
      type: String,
      required: true,
    },
    maxRegistrations: {
      type: Number,
      required: true,
      min: 1,
    },
    currentRegistrations: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DONE", "FULL"],
      default: "ACTIVE",
    },
    donationUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationUnit",
      required: true,
    },
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Thêm index để tối ưu tìm kiếm
eventSchema.index({ name: "text", location: "text" });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ status: 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
