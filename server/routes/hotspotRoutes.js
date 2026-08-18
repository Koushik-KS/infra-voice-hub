const express = require("express");

const {
  getHotspots,
} = require("../controllers/requestController");

const router = express.Router();

router.get("/", getHotspots);

module.exports = router;