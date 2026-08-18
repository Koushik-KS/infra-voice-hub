const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const requestRoutes = require("./routes/requestRoutes");
const hotspotRoutes = require("./routes/hotspotRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/requests", requestRoutes);
app.use("/api/hotspots", hotspotRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CivilIntel API is running",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      `MongoDB Connected: ${mongoose.connection.host}`
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `CivilIntel API running on port ${PORT}`
  );
});