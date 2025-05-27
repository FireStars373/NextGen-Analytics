const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const pool = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const teamsRoutes = require("./routes/teams");
const playersRoutes = require("./routes/players");
const playerStatsRoutes = require("./routes/playerStats");
const matchRoutes = require("./routes/matches");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/players", playersRoutes);
app.use("/api/player_stats", playerStatsRoutes);
app.use("/api/euroleaguematches", matchRoutes);
app.use(
  "/images",
  express.static(path.join(__dirname, "../Components/Assets/TeamLogo"))
);
app.use(
  "/images",
  express.static(path.join(__dirname, "../Components/Assets/PlayerPhoto"))
);

// Test database connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database");
    connection.release();
  })
  .catch((err) => {
    console.error("MySQL connection error:", err);
  });

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});

module.exports = app;
