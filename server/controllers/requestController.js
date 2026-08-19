const Request = require("../models/Request");

// ===============================
// LANGUAGE DETECTION
// ===============================
function detectLanguage(text) {
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return "Kannada";
  }

  // Hindi / Devanagari
  if (/[\u0900-\u097F]/.test(text)) {
    return "Hindi";
  }

  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return "Chinese";
  }

  // Russian / Cyrillic
  if (/[\u0400-\u04FF]/.test(text)) {
    return "Russian";
  }

  const message = text.toLowerCase();

  // Portuguese detection
  const portugueseWords = [
    "água",
    "estrada",
    "hospital",
    "saúde",
    "escola",
    "eletricidade",
    "urgente",
    "ajuda",
    "problema",
    "precisamos",
    "preciso",
    "não",
    "para",
  ];

  if (portugueseWords.some((word) => message.includes(word))) {
    return "Portuguese";
  }

  // Default
  return "English";
}

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
    message.includes("ನೀರು") ||
    message.includes("ಕುಡಿಯುವ ನೀರು") ||
    message.includes("पानी") ||
    message.includes("水") ||
    message.includes("вода") ||
    message.includes("água")
  ) {
    return "Water";
  }

  // Road
  if (
    message.includes("road") ||
    message.includes("roads") ||
    message.includes("pothole") ||
    message.includes("highway") ||
    message.includes("street") ||
    message.includes("ರಸ್ತೆ") ||
    message.includes("ಗುಂಡಿ") ||
    message.includes("सड़क") ||
    message.includes("道路") ||
    message.includes("дорога") ||
    message.includes("estrada")
  ) {
    return "Road";
  }

  // Healthcare
  if (
    message.includes("hospital") ||
    message.includes("doctor") ||
    message.includes("health") ||
    message.includes("medical") ||
    message.includes("clinic") ||
    message.includes("ಆಸ್ಪತ್ರೆ") ||
    message.includes("ಆರೋಗ್ಯ") ||
    message.includes("अस्पताल") ||
    message.includes("स्वास्थ्य") ||
    message.includes("医院") ||
    message.includes("健康") ||
    message.includes("больница") ||
    message.includes("здоровье") ||
    message.includes("saúde")
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
    message.includes("ಕಾಲೇಜು") ||
    message.includes("शिक्षा") ||
    message.includes("स्कूल") ||
    message.includes("学校") ||
    message.includes("образование") ||
    message.includes("escola")
  ) {
    return "Education";
  }

  // Electricity
  if (
    message.includes("electricity") ||
    message.includes("power") ||
    message.includes("electric") ||
    message.includes("ವಿದ್ಯುತ್") ||
    message.includes("ಕರೆಂಟ್") ||
    message.includes("बिजली") ||
    message.includes("电力") ||
    message.includes("электричество") ||
    message.includes("eletricidade")
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
    message.includes("ಚರಂಡಿ") ||
    message.includes("कचरा") ||
    message.includes("垃圾") ||
    message.includes("мусор") ||
    message.includes("lixo")
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
    message.includes("ಬೆಳೆ") ||
    message.includes("किसान") ||
    message.includes("कृषि") ||
    message.includes("农民") ||
    message.includes("农业") ||
    message.includes("фермер") ||
    message.includes("agricultura")
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

  // Critical
  if (
    message.includes("emergency") ||
    message.includes("danger") ||
    message.includes("death") ||
    message.includes("urgent") ||
    message.includes("critical") ||
    message.includes("ತುರ್ತು") ||
    message.includes("ಅಪಾಯ") ||
    message.includes("ಸಾವು") ||
    message.includes("आपातकाल") ||
    message.includes("खतरा") ||
    message.includes("紧急") ||
    message.includes("危险") ||
    message.includes("срочно") ||
    message.includes("опасность") ||
    message.includes("emergência") ||
    message.includes("perigo")
  ) {
    return "Critical";
  }

  // High
  if (
    message.includes("serious") ||
    message.includes("immediately") ||
    message.includes("major") ||
    message.includes("severe") ||
    message.includes("quickly") ||
    message.includes("ಗಂಭೀರ") ||
    message.includes("ತಕ್ಷಣ") ||
    message.includes("गंभीर") ||
    message.includes("तुरंत") ||
    message.includes("严重") ||
    message.includes("немедленно") ||
    message.includes("grave") ||
    message.includes("imediatamente")
  ) {
    return "High";
  }

  // Low
  if (
    message.includes("small") ||
    message.includes("minor") ||
    message.includes("ಚಿಕ್ಕ") ||
    message.includes("ಸಣ್ಣ") ||
    message.includes("छोटी") ||
    message.includes("小") ||
    message.includes("незначительный") ||
    message.includes("pequeno")
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

    if (!state?.trim()) {
      return res.status(400).json({
        success: false,
        message: "State is required",
      });
    }

    if (!district?.trim()) {
      return res.status(400).json({
        success: false,
        message: "District is required",
      });
    }

    // AI-style detection
    const language = detectLanguage(requestText);
    const category = detectCategory(requestText);
    const priority = detectPriority(requestText);

    // Normalize source
    let normalizedSource = "Web";

    if (source === "Voice") {
      normalizedSource = "Voice";
    } else if (source === "Messaging") {
      normalizedSource = "WhatsApp";
    } else if (source === "Mobile") {
      normalizedSource = "Mobile";
    } else if (source === "WhatsApp") {
      normalizedSource = "WhatsApp";
    }

    // Create request
    const request = await Request.create({
      citizenName:
        citizenName?.trim() || "Anonymous Citizen",

      requestText: requestText.trim(),

      language,

      category,

      priority,

      status: "Received",

      country: country?.trim() || "India",

      state: state.trim(),

      district: district.trim(),

      source: normalizedSource,

      aiAnalysis:
        `CivilIntel Analysis: ` +
        `Language: ${language}. ` +
        `Detected category: ${category}. ` +
        `Priority level: ${priority}. ` +
        `Source: ${normalizedSource}.`,
    });

    return res.status(201).json({
      success: true,
      message: "Citizen request created successfully",
      data: request,
    });
  } catch (error) {
    console.error("Create Request Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create citizen request",
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
    console.error("Get Requests Error:", error);

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
                { $eq: ["$priority", "Critical"] },
                1,
                0,
              ],
            },
          },

          highCount: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "High"] },
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
    console.error("Get Hotspots Error:", error);

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