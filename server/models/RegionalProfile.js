const mongoose = require("mongoose");

const regionalProfileSchema = new mongoose.Schema(
  {
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

    population: {
      type: Number,
      default: 0,
    },

    infrastructureIndex: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    publicInvestment: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

regionalProfileSchema.index(
  {
    country: 1,
    state: 1,
    district: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "RegionalProfile",
  regionalProfileSchema
);