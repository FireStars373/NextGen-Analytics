const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all teams
router.get("/", async (req, res) => {
  try {
    const [teams] = await db.query(`
      SELECT id, name, league, wins, losses, points_per_game, points_allowed, 
             rebounds, assists, steals, blocks, created_at, updated_at, description, logo
      FROM teams
      ORDER BY league, wins DESC
    `);

    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res
      .status(500)
      .json({ message: "Error fetching teams data", error: err.message });
  }
});

// GET team by ID
router.get("/:id", async (req, res) => {
  try {
    const [teams] = await db.query(
      `
      SELECT id, name, league, wins, losses, points_per_game, points_allowed, 
             rebounds, assists, steals, blocks, created_at, updated_at, description, logo
      FROM teams
      WHERE id = ?
    `,
      [req.params.id]
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(teams[0]);
  } catch (err) {
    console.error("Error fetching team:", err);
    res
      .status(500)
      .json({ message: "Error fetching team data", error: err.message });
  }
});

// GET team by name
router.get("/name/:name", async (req, res) => {
  try {
    const [teams] = await db.query(
      `
      SELECT id, name, league, wins, losses, points_per_game, points_allowed, 
             rebounds, assists, steals, blocks, created_at, updated_at, description, logo
      FROM teams
      WHERE name = ?
    `,
      [req.params.name]
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(teams[0]);
  } catch (err) {
    console.error("Error fetching team by name:", err);
    res
      .status(500)
      .json({ message: "Error fetching team data", error: err.message });
  }
});

// GET teams by league
router.get("/league/:league", async (req, res) => {
  try {
    const [teams] = await db.query(
      `
      SELECT id, name, league, wins, losses, points_per_game, points_allowed, 
             rebounds, assists, steals, blocks, created_at, updated_at, description, logo
      FROM teams
      WHERE league = ?
      ORDER BY wins DESC
    `,
      [req.params.league]
    );

    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams by league:", err);
    res
      .status(500)
      .json({ message: "Error fetching teams data", error: err.message });
  }
});

module.exports = router;
