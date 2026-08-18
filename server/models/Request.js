const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    citizenName: {
      type: String,
      trim: true,
      default: "Anonymous Citizen",
    },

    requestText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },

    language: {
      type: String,
      default: "en",
    },

    category: {
      type: String,
      enum: [
        "Water",
        "Road",
        "Healthcare",
        "Agriculture",
        "Education",
        "Electricity",
        "Sanitation",
        "Other",
      ],
      default: "Other",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    status: {
      type: String,
      default: "Received",
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
      enum: [
        "Text",
        "Voice",
        "Messaging",
        "Web",
        "Mobile",
        "WhatsApp",
      ],
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