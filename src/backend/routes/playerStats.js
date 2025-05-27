const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all player stats
router.get("/", async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT * FROM player_stats
      ORDER BY created_at DESC
    `);

    res.json(stats);
  } catch (err) {
    console.error("Error fetching player stats:", err);
    res
      .status(500)
      .json({ message: "Error fetching player stats", error: err.message });
  }
});

// GET player stats by player ID
router.get("/:playerId", async (req, res) => {
  try {
    const [stats] = await db.query(
      `SELECT * FROM player_stats WHERE player_id = ? ORDER BY created_at DESC`,
      [req.params.playerId]
    );

    if (stats.length === 0) {
      return res.status(404).json({ message: "Player stats not found" });
    }

    res.json(stats);
  } catch (err) {
    console.error("Error fetching player stats by player ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching player stats", error: err.message });
  }
});

module.exports = router;
