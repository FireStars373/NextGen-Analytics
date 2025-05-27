const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

function randomFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

async function generateData() {
  const conn = await pool.getConnection();
  try {
    for (let player_id = 1; player_id <= 291; player_id++) {
      for (let game = 0; game < 6; game++) {
        // Generate realistic random stats (modify ranges as you want)
        const points = randomFloat(0, 40);
        const rebounds = randomFloat(0, 15);
        const assists = randomFloat(0, 15);
        const minutes = randomFloat(10, 40);
        const fg2_attempts = randomFloat(0, 20);
        const fg2_made = Math.min(fg2_attempts, randomFloat(0, fg2_attempts));
        const fg3_attempts = randomFloat(0, 10);
        const fg3_made = Math.min(fg3_attempts, randomFloat(0, fg3_attempts));
        const ft_attempts = randomFloat(0, 15);
        const ft_made = Math.min(ft_attempts, randomFloat(0, ft_attempts));
        const steals = randomFloat(0, 5);
        const blocks = randomFloat(0, 5);
        const turnovers = randomFloat(0, 10);
        const fouls_received = randomFloat(0, 6);
        const pir = randomFloat(0, 50);

        await conn.execute(
          `INSERT INTO player_stats 
            (player_id, points, rebounds, assists, minutes, fg2_made, fg3_made, ft_made, steals, blocks, turnovers, fouls_received, pir) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            player_id,
            points,
            rebounds,
            assists,
            minutes,
            fg2_made,
            fg3_made,
            ft_made,
            steals,
            blocks,
            turnovers,
            fouls_received,
            pir,
          ]
        );
      }
    }
    console.log("Player stats data generated successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    conn.release();
  }
}

generateData();
