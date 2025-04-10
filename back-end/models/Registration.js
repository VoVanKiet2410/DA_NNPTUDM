const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    healthSurvey: {
      hasChronicIllness: {
        type: Boolean,
        required: true,
      },
      hasRecentIllness: {
        type: Boolean,
        required: true,
      },
      hasSymptoms: {
        type: Boolean,
        required: true,
      },
      isPregnant: {
        type: Boolean,
        required: true,
      },
      isBreastfeeding: {
        type: Boolean,
        required: true,
      },
      hasHIVTest: {
        type: Boolean,
        required: true,
      },
      notes: {
        type: String,
        trim: true,
      },
    },
    donationInfo: {
      bloodType: {
        type: String,
        enum: ["A", "B", "O", "AB"],
        required: true,
      },
      rhFactor: {
        type: String,
        enum: ["+", "-"],
        required: true,
      },
      lastDonationDate: {
        type: Date,
      },
      donationHistory: [{
        date: Date,
        location: String,
        amount: Number,
      }],
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Thêm index để tối ưu tìm kiếm
registrationSchema.index({ user: 1, event: 1 }, { unique: true });
registrationSchema.index({ status: 1 });
registrationSchema.index({ registrationDate: 1 });

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;