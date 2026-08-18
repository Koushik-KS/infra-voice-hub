const Request = require("../models/Request");

// Simple AI-style category detection
function detectCategory(text) {
  const message = text.toLowerCase();

  if (
    message.includes("water") ||
    message.includes("drinking water") ||
    message.includes("borewell")
  ) {
    return "Water";
  }

  if (
    message.includes("road") ||
    message.includes("pothole") ||
    message.includes("highway")
  ) {
    return "Roads";
  }

  if (
    message.includes("hospital") ||
    message.includes("doctor") ||
    message.includes("health") ||
    message.includes("medical")
  ) {
    return "Healthcare";
  }

  if (
    message.includes("school") ||
    message.includes("college") ||
    message.includes("teacher") ||
    message.includes("education")
  ) {
    return "Education";
  }

  if (
    message.includes("electricity") ||
    message.includes("power") ||
    message.includes("current")
  ) {
    return "Electricity";
  }

  if (
    message.includes("garbage") ||
    message.includes("drainage") ||
    message.includes("sanitation") ||
    message.includes("waste")
  ) {
    return "Sanitation";
  }

  if (
    message.includes("farmer") ||
    message.includes("crop") ||
    message.includes("agriculture") ||
    message.includes("irrigation")
  ) {
    return "Agriculture";
  }

  return "Other";
}

// Priority detection
function detectPriority(text) {
  const message = text.toLowerCase();

  if (
    message.includes("emergency") ||
    message.includes("danger") ||
    message.includes("death") ||
    message.includes("urgent")
  ) {
    return "Critical";
  }

  if (
    message.includes("serious") ||
    message.includes("immediately") ||
    message.includes("major")
  ) {
    return "High";
  }

  return "Medium";
}

// Create citizen request
const createRequest = async (req, res) => {
  try {
    const {
      citizenName,
      requestText,
      country,
      state,
      district,
      source,
    } = req.body;

    if (!requestText || !state || !district) {
      return res.status(400).json({
        message:
          "requestText, state and district are required",
      });
    }

    const category = detectCategory(requestText);
    const priority = detectPriority(requestText);

    const request = await Request.create({
      citizenName,
      requestText,
      category,
      priority,
      country: country || "India",
      state,
      district,
      source: source || "Web",
      aiAnalysis: `Detected category: ${category}. Priority level: ${priority}.`,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Create Request Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create citizen request",
    });
  }
};

// Get all requests
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Get Requests Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
};