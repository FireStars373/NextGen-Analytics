const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const photoFolder = path.join(__dirname, "../../Components/Assets/PlayerPhoto");

async function updatePlayerPhotos() {
  const connection = await pool.getConnection();

  try {
    const files = fs.readdirSync(photoFolder);

    for (const file of files) {
      const playerId = path.parse(file).name;

      const photoPath = `/images/${file}`;

      const [result] = await connection.execute(
        "UPDATE players SET photo = ? WHERE name = ?",
        [photoPath, playerId]
      );

      console.log(`Updated logo for ${playerId} with path ${photoPath}`);
    }

    console.log("All logos updated successfully.");
  } catch (error) {
    console.error("Error updating logos:", error);
  } finally {
    connection.release();
  }
}

updatePlayerPhotos();
