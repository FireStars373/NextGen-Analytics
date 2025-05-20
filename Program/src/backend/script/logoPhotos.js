const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const photoFolder = path.join(__dirname, "../../Components/Assets/TeamLogo");

async function updatePlayerPhotos() {
  const connection = await pool.getConnection();

  try {
    const files = fs.readdirSync(photoFolder);

    for (const file of files) {
      const logoId = path.parse(file).name;

      const photoPath = `/images/${file}`;

      const [result] = await connection.execute(
        "UPDATE teams SET logo = ? WHERE name = ?",
        [photoPath, logoId]
      );

      console.log(`Updated logo for ${logoId} with path ${photoPath}`);
    }

    console.log("All logos updated successfully.");
  } catch (error) {
    console.error("Error updating logos:", error);
  } finally {
    connection.release();
  }
}

updatePlayerPhotos();
