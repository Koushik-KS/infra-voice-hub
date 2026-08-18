const Request = require("../models/Request");

// ==========================================
// REGIONAL DEVELOPMENT DATA
// ==========================================
// Currently stored locally for the project.
// Later, this can be moved to MongoDB or
// connected to verified government datasets.

const REGIONAL_DATA = {
  Karnataka: {
    Chikkamagaluru: {
      population: 1137961,
      publicInvestment: 128,
      infrastructureIndex: 42,
    },

    Hassan: {
      population: 1776421,
      publicInvestment: 165,
      infrastructureIndex: 55,
    },

    Mysuru: {
      population: 3001127,
      publicInvestment: 320,
      infrastructureIndex: 68,
    },

    Bengaluru: {
      population: 9621551,
      publicInvestment: 850,
      infrastructureIndex: 82,
    },

    Mandya: {
      population: 1805769,
      publicInvestment: 150,
      infrastructureIndex: 58,
    },

    Raichur: {
      population: 1928812,
      publicInvestment: 140,
      infrastructureIndex: 40,
    },

    Kalaburagi: {
      population: 2566326,
      publicInvestment: 190,
      infrastructureIndex: 47,
    },

    Belagavi: {
      population: 4779661,
      publicInvestment: 260,
      infrastructureIndex: 63,
    },
  },
};

// ==========================================
// GET REGIONAL DATA
// ==========================================

function getRegionalData(state, district) {
  return (
    REGIONAL_DATA[state]?.[district] ?? {
      population: 0,
      publicInvestment: 0,
      infrastructureIndex: 0,
    }
  );
}

// ==========================================
// GET PROJECT RECOMMENDATIONS
// ==========================================

const getRecommendations = async (req, res) => {
  try {
    const { country, state, district } = req.query;

    const matchFilter = {};

    // Filter by country
    if (country) {
      matchFilter.country = country;
    }

    // Filter by state
    if (state) {
      matchFilter.state = state;
    }

    // Filter by district
    if (district) {
      matchFilter.district = district;
    }

    // ==========================================
    // CATEGORY-WISE CITIZEN DEMAND
    // ==========================================

    const recommendations = await Request.aggregate([
      {
        $match: matchFilter,
      },

      {
        $group: {
          _id: {
            country: "$country",
            state: "$state",
            district: "$district",
            category: "$category",
          },

          // Total requests in this category
          citizenDemand: {
            $sum: 1,
          },

          // Critical priority requests
          criticalCount: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "Critical"] },
                1,
                0,
              ],
            },
          },

          // High priority requests
          highCount: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "High"] },
                1,
                0,
              ],
            },
          },

          // Medium priority requests
          mediumCount: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "Medium"] },
                1,
                0,
              ],
            },
          },

          // Low priority requests
          lowCount: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "Low"] },
                1,
                0,
              ],
            },
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

          citizenDemand: 1,
          criticalCount: 1,
          highCount: 1,
          mediumCount: 1,
          lowCount: 1,
        },
      },
    ]);

    // ==========================================
    // DISTRICT-WISE TOTAL STATISTICS
    // ==========================================

    const districtStats = await Request.aggregate([
      {
        $match: matchFilter,
      },

      {
        $group: {
          _id: {
            country: "$country",
            state: "$state",
            district: "$district",
          },

          // Total requests in the district
          totalRequests: {
            $sum: 1,
          },

          // Total critical requests in district
          criticalRequests: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "Critical"] },
                1,
                0,
              ],
            },
          },

          // Total high priority requests
          highRequests: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "High"] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // ==========================================
    // CREATE DISTRICT STATISTICS LOOKUP
    // ==========================================

    const statsMap = {};

    districtStats.forEach((item) => {
      const key =
        `${item._id.country}-${item._id.state}-${item._id.district}`;

      statsMap[key] = {
        totalRequests: item.totalRequests,
        criticalRequests: item.criticalRequests,
        highRequests: item.highRequests,
      };
    });

    // ==========================================
    // CREATE RECOMMENDATIONS + PRIORITY SCORE
    // ==========================================

    const formattedRecommendations = recommendations.map((item) => {
      // Get fixed regional information
      const regionalData = getRegionalData(
        item.state,
        item.district
      );

      // Find total district statistics
      const key =
        `${item.country}-${item.state}-${item.district}`;

      const stats = statsMap[key] ?? {
        totalRequests: item.citizenDemand,
        criticalRequests: item.criticalCount,
        highRequests: item.highCount,
      };

      // ==========================================
      // PRIORITY SCORE CALCULATION
      // Total Maximum = 100 points
      // ==========================================

      // ------------------------------------------
      // 1. Citizen Demand
      // Maximum: 30 points
      // ------------------------------------------

      const citizenDemandScore = Math.min(
        item.citizenDemand * 10,
        30
      );

      // ------------------------------------------
      // 2. Urgency
      // Maximum: 30 points
      // Critical = 15 points each
      // High = 8 points each
      // Medium = 3 points each
      // ------------------------------------------

      const urgencyScore = Math.min(
        item.criticalCount * 15 +
          item.highCount * 8 +
          item.mediumCount * 3,
        30
      );

      // ------------------------------------------
      // 3. Infrastructure Gap
      // Maximum: 15 points
      // Lower infrastructure = higher priority
      // ------------------------------------------

      const infrastructureGap = Math.min(
        ((100 - regionalData.infrastructureIndex) / 100) * 15,
        15
      );

      // ------------------------------------------
      // 4. Population Impact
      // Maximum: 15 points
      // ------------------------------------------

      const populationImpact = Math.min(
        (regionalData.population / 1000000) * 5,
        15
      );

      // ------------------------------------------
      // 5. Investment Gap
      // Maximum: 10 points
      // Lower investment = higher priority
      // ------------------------------------------

      const investmentGap = Math.max(
        0,
        Math.min(
          10,
          10 - regionalData.publicInvestment / 50
        )
      );

      // ==========================================
      // FINAL SCORE
      // ==========================================

      const totalScore = Math.min(
        100,
        Math.round(
          citizenDemandScore +
            urgencyScore +
            infrastructureGap +
            populationImpact +
            investmentGap
        )
      );

      // ==========================================
      // PRIORITY LEVEL
      // ==========================================

      let level = "Low";

      if (totalScore >= 75) {
        level = "Critical";
      } else if (totalScore >= 55) {
        level = "High";
      } else if (totalScore >= 30) {
        level = "Medium";
      }

      // ==========================================
      // RECOMMENDATION OBJECT
      // ==========================================

      return {
        ...item,

        recommendedProject:
          `Prioritize ${item.category} project`,

        priority: {
          totalScore,
          level,

          breakdown: {
            citizenDemand: Math.round(
              citizenDemandScore
            ),

            urgency: Math.round(
              urgencyScore
            ),

            infrastructureGap: Math.round(
              infrastructureGap
            ),

            populationImpact: Math.round(
              populationImpact
            ),

            investmentGap: Math.round(
              investmentGap
            ),
          },
        },

        // Regional Intelligence data
        regionalContext: {
          population: regionalData.population,

          infrastructureIndex:
            regionalData.infrastructureIndex,

          publicInvestment:
            regionalData.publicInvestment,

          // Live data from MongoDB
          totalRequests: stats.totalRequests,

          criticalRequests:
            stats.criticalRequests,

          highRequests:
            stats.highRequests,
        },

        explanation:
          `${stats.totalRequests} citizen request(s) were received in ` +
          `${item.district}, ${item.state}. ` +
          `${item.citizenDemand} request(s) specifically relate to ` +
          `${item.category.toLowerCase()}. ` +
          `${stats.criticalRequests} request(s) are classified as critical. ` +
          `The region has an infrastructure index of ` +
          `${regionalData.infrastructureIndex}/100 and the calculated ` +
          `project priority score is ${totalScore}/100.`,
      };
    });

    // ==========================================
    // SORT BY HIGHEST PRIORITY
    // ==========================================

    formattedRecommendations.sort(
      (a, b) =>
        b.priority.totalScore -
        a.priority.totalScore
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      data: formattedRecommendations,
    });
  } catch (error) {
    console.error(
      "Get Recommendations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getRecommendations,
};