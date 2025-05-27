const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all matches
router.get("/", async (req, res) => {
  try {
    const [matches] = await db.query(`
      SELECT * FROM euroleaguematches
      ORDER BY match_date DESC
    `);
    res.json(matches);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res
      .status(500)
      .json({ message: "Error fetching matches", error: err.message });
  }
});

// GET match by ID
router.get("/:id", async (req, res) => {
  try {
    const [matches] = await db.query(
      `SELECT * FROM euroleaguematches WHERE id = ?`,
      [req.params.id]
    );

    if (matches.length === 0) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(matches[0]);
  } catch (err) {
    console.error("Error fetching match by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching match", error: err.message });
  }
});

// GET matches by team ID (either as home or away)
router.get("/team/:teamId", async (req, res) => {
  try {
    const [matches] = await db.query(
      `
      SELECT * FROM euroleaguematches
      WHERE home_team_id = ? OR away_team_id = ?
      ORDER BY match_date DESC
      `,
      [req.params.teamId, req.params.teamId]
    );

    if (matches.length === 0) {
      return res
        .status(404)
        .json({ message: "No matches found for this team" });
    }

    res.json(matches);
  } catch (err) {
    console.error("Error fetching matches for team:", err);
    res
      .status(500)
      .json({ message: "Error fetching matches", error: err.message });
  }
});

// GET player stats for a match
router.get("/:id/player-stats", async (req, res) => {
  try {
    const [stats] = await db.query(
      `SELECT emp.*, p.name as player_name, t.name as team_name 
       FROM euroleaguematchplayers emp
       JOIN players p ON emp.player_id = p.id
       JOIN teams t ON emp.team_id = t.id
       WHERE emp.match_id = ?`,
      [req.params.id]
    );

    if (stats.length === 0) {
      return res.status(404).json({ message: "No player stats found for this match" });
    }

    res.json(stats);
  } catch (err) {
    console.error("Error fetching player stats:", err);
    res.status(500).json({ message: "Error fetching player stats", error: err.message });
  }
});

module.exports = router;
