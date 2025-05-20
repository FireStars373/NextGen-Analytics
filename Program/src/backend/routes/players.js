const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all players
router.get("/", async (req, res) => {
  try {
    const [players] = await db.query(`
      SELECT * FROM players
      ORDER BY pir DESC
    `);

    res.json(players);
  } catch (err) {
    console.error("Error fetching players:", err);
    res
      .status(500)
      .json({ message: "Error fetching players", error: err.message });
  }
});

// GET player by ID
router.get("/:id", async (req, res) => {
  try {
    const [players] = await db.query(`SELECT * FROM players WHERE id = ?`, [
      req.params.id,
    ]);

    if (players.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(players[0]);
  } catch (err) {
    console.error("Error fetching player by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching player", error: err.message });
  }
});

// GET player by name
router.get("/name/:name", async (req, res) => {
  try {
    const [players] = await db.query(`SELECT * FROM players WHERE name = ?`, [
      req.params.name,
    ]);

    if (players.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(players[0]);
  } catch (err) {
    console.error("Error fetching player by name:", err);
    res
      .status(500)
      .json({ message: "Error fetching player", error: err.message });
  }
});

module.exports = router;
