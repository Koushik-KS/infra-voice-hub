const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    citizenName: {
      type: String,
      trim: true,
      default: "Anonymous",
    },

    requestText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },

    category: {
      type: String,
      enum: [
        "Water",
        "Roads",
        "Healthcare",
        "Education",
        "Electricity",
        "Sanitation",
        "Agriculture",
        "Other",
      ],
      default: "Other",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    country: {
      type: String,
      required: true,
      default: "India",
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      enum: ["Web", "Mobile", "Voice", "WhatsApp"],
      default: "Web",
    },

    aiAnalysis: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Request = mongoose.model(
  "Request",
  requestSchema,
);

module.exports = Request;