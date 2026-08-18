const Request = require("../models/Request");

// ===============================
// CATEGORY DETECTION
// ===============================
function detectCategory(text) {
  const message = text.toLowerCase();

  // Water
  if (
    message.includes("water") ||
    message.includes("drinking water") ||
    message.includes("borewell") ||
    message.includes("water supply") ||
    message.includes("ಕುಡಿಯುವ ನೀರು") ||
    message.includes("ನೀರು")
  ) {
    return "Water";
  }

  // Roads
  if (
    message.includes("road") ||
    message.includes("roads") ||
    message.includes("pothole") ||
    message.includes("highway") ||
    message.includes("street") ||
    message.includes("ರಸ್ತೆ") ||
    message.includes("ಗುಂಡಿ")
  ) {
    return "Roads";
  }

  // Healthcare
  if (
    message.includes("hospital") ||
    message.includes("doctor") ||
    message.includes("health") ||
    message.includes("medical") ||
    message.includes("clinic") ||
    message.includes("ಆಸ್ಪತ್ರೆ") ||
    message.includes("ಆರೋಗ್ಯ")
  ) {
    return "Healthcare";
  }

  // Education
  if (
    message.includes("school") ||
    message.includes("college") ||
    message.includes("teacher") ||
    message.includes("education") ||
    message.includes("ಶಾಲೆ") ||
    message.includes("ಕಾಲೇಜು")
  ) {
    return "Education";
  }

  // Electricity
  if (
    message.includes("electricity") ||
    message.includes("power") ||
    message.includes("current") ||
    message.includes("electric") ||
    message.includes("ವಿದ್ಯುತ್") ||
    message.includes("ಕರೆಂಟ್")
  ) {
    return "Electricity";
  }

  // Sanitation
  if (
    message.includes("garbage") ||
    message.includes("drainage") ||
    message.includes("sanitation") ||
    message.includes("waste") ||
    message.includes("sewage") ||
    message.includes("ಕಸ") ||
    message.includes("ಚರಂಡಿ")
  ) {
    return "Sanitation";
  }

  // Agriculture
  if (
    message.includes("farmer") ||
    message.includes("crop") ||
    message.includes("agriculture") ||
    message.includes("irrigation") ||
    message.includes("farming") ||
    message.includes("ರೈತ") ||
    message.includes("ಕೃಷಿ") ||
    message.includes("ಬೆಳೆ")
  ) {
    return "Agriculture";
  }

  return "Other";
}

// ===============================
// PRIORITY DETECTION
// ===============================
function detectPriority(text) {
  const message = text.toLowerCase();

  if (
    message.includes("emergency") ||
    message.includes("danger") ||
    message.includes("death") ||
    message.includes("urgent") ||
    message.includes("critical") ||
    message.includes("emergency situation") ||
    message.includes("ತುರ್ತು") ||
    message.includes("ಅಪಾಯ") ||
    message.includes("ಸಾವು")
  ) {
    return "Critical";
  }

  if (
    message.includes("serious") ||
    message.includes("immediately") ||
    message.includes("major") ||
    message.includes("severe") ||
    message.includes("quickly") ||
    message.includes("ಗಂಭೀರ") ||
    message.includes("ತಕ್ಷಣ")
  ) {
    return "High";
  }

  if (
    message.includes("small") ||
    message.includes("minor")
  ) {
    return "Low";
  }

  return "Medium";
}

// ===============================
// CREATE REQUEST
// ===============================
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

    if (!requestText?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Development request is required",
      });
    }

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required",
      });
    }

    if (!district) {
      return res.status(400).json({
        success: false,
        message: "District is required",
      });
    }

    const category = detectCategory(requestText);
    const priority = detectPriority(requestText);

    // Convert frontend values to backend schema values
    let normalizedSource = "Web";

    if (source === "Voice") {
      normalizedSource = "Voice";
    }

    if (source === "Messaging") {
      normalizedSource = "WhatsApp";
    }

    const request = await Request.create({
      citizenName:
        citizenName?.trim() || "Anonymous Citizen",

      requestText: requestText.trim(),

      category,

      priority,

      country: country || "India",

      state,

      district,

      source: normalizedSource,

      aiAnalysis:
        `CivilIntel Analysis: ` +
        `Detected category: ${category}. ` +
        `Priority level: ${priority}.`,
    });

    return res.status(201).json({
      success: true,
      message: "Citizen request created successfully",
      data: request,
    });
  } catch (error) {
    console.error(
      "Create Request Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create citizen request",
    });
  }
};

// ===============================
// GET REQUESTS
// ===============================
const getRequests = async (req, res) => {
  try {
    const { country } = req.query;

    const filter = {};

    if (country) {
      filter.country = country;
    }

    const requests = await Request.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(
      "Get Requests Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

// ===============================
// GET DEMAND HOTSPOTS
// ===============================
const getHotspots = async (req, res) => {
  try {
    const { country } = req.query;

    const matchStage = {};

    if (country) {
      matchStage.country = country;
    }

    const hotspots = await Request.aggregate([
      {
        $match: matchStage,
      },

      {
        $group: {
          _id: {
            country: "$country",
            state: "$state",
            district: "$district",
            category: "$category",
          },

          requestCount: {
            $sum: 1,
          },

          criticalCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$priority",
                    "Critical",
                  ],
                },
                1,
                0,
              ],
            },
          },

          highCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$priority",
                    "High",
                  ],
                },
                1,
                0,
              ],
            },
          },

          latestRequest: {
            $max: "$createdAt",
          },
        },
      },

      {
        $project: {
          _id: 0,

          country: "$_id.country",

          state: "$_id.state",

          district: "$_id.district",

          category: "$_id.category",

          requestCount: 1,

          criticalCount: 1,

          highCount: 1,

          latestRequest: 1,
        },
      },

      {
        $sort: {
          criticalCount: -1,
          highCount: -1,
          requestCount: -1,
          latestRequest: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: hotspots,
    });
  } catch (error) {
    console.error(
      "Get Hotspots Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch demand hotspots",
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getHotspots,
};