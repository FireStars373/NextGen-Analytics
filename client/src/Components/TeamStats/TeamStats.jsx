import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TeamStats.css";
import Graphs from "../Graphs/Graphs";
import BetOverlay from "../BetOverlay/BetOverlay";

const teamData = {
  "Real Madrid": [
    {
      points_per_game: 95,
      points_allowed: 80,
      rebounds: 38,
      assists: 24,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 91,
      points_allowed: 75,
      rebounds: 40,
      assists: 22,
      steals: 8,
      blocks: 6,
    },
    {
      points_per_game: 88,
      points_allowed: 78,
      rebounds: 37,
      assists: 21,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 93,
      points_allowed: 82,
      rebounds: 36,
      assists: 25,
      steals: 11,
      blocks: 7,
    },
    {
      points_per_game: 89,
      points_allowed: 79,
      rebounds: 39,
      assists: 23,
      steals: 8,
      blocks: 6,
    },
    {
      points_per_game: 90,
      points_allowed: 76,
      rebounds: 38,
      assists: 24,
      steals: 10,
      blocks: 5,
    },
  ],
  "Baskonia Vitoria-Gasteiz": [
    {
      points_per_game: 85,
      points_allowed: 82,
      rebounds: 35,
      assists: 20,
      steals: 9,
      blocks: 3,
    },
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 37,
      assists: 22,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 90,
      points_allowed: 83,
      rebounds: 36,
      assists: 21,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 84,
      points_allowed: 79,
      rebounds: 34,
      assists: 19,
      steals: 7,
      blocks: 3,
    },
    {
      points_per_game: 87,
      points_allowed: 81,
      rebounds: 35,
      assists: 20,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 86,
      points_allowed: 80,
      rebounds: 36,
      assists: 21,
      steals: 8,
      blocks: 3,
    },
  ],

  "FC Barcelona": [
    {
      points_per_game: 92,
      points_allowed: 77,
      rebounds: 39,
      assists: 25,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 90,
      points_allowed: 79,
      rebounds: 37,
      assists: 24,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 93,
      points_allowed: 80,
      rebounds: 38,
      assists: 23,
      steals: 11,
      blocks: 6,
    },
    {
      points_per_game: 91,
      points_allowed: 76,
      rebounds: 40,
      assists: 26,
      steals: 9,
      blocks: 7,
    },
    {
      points_per_game: 89,
      points_allowed: 78,
      rebounds: 37,
      assists: 22,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 94,
      points_allowed: 75,
      rebounds: 39,
      assists: 24,
      steals: 10,
      blocks: 6,
    },
  ],

  "Paris Basketball": [
    {
      points_per_game: 89,
      points_allowed: 81,
      rebounds: 38,
      assists: 23,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 92,
      points_allowed: 79,
      rebounds: 40,
      assists: 22,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 87,
      points_allowed: 80,
      rebounds: 36,
      assists: 21,
      steals: 10,
      blocks: 4,
    },
    {
      points_per_game: 90,
      points_allowed: 78,
      rebounds: 37,
      assists: 23,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 88,
      points_allowed: 82,
      rebounds: 35,
      assists: 20,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 91,
      points_allowed: 77,
      rebounds: 39,
      assists: 24,
      steals: 10,
      blocks: 5,
    },
  ],

  "Olympiacos Piraeus": [
    {
      points_per_game: 86,
      points_allowed: 79,
      rebounds: 36,
      assists: 22,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 90,
      points_allowed: 76,
      rebounds: 38,
      assists: 24,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 88,
      points_allowed: 78,
      rebounds: 37,
      assists: 23,
      steals: 10,
      blocks: 6,
    },
    {
      points_per_game: 85,
      points_allowed: 81,
      rebounds: 35,
      assists: 21,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 89,
      points_allowed: 77,
      rebounds: 36,
      assists: 22,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 87,
      points_allowed: 80,
      rebounds: 37,
      assists: 23,
      steals: 9,
      blocks: 6,
    },
  ],

  "Fenerbahce Beko Istanbul": [
    {
      points_per_game: 88,
      points_allowed: 79,
      rebounds: 38,
      assists: 23,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 91,
      points_allowed: 76,
      rebounds: 40,
      assists: 25,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 87,
      points_allowed: 78,
      rebounds: 37,
      assists: 22,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 89,
      points_allowed: 80,
      rebounds: 36,
      assists: 21,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 92,
      points_allowed: 77,
      rebounds: 39,
      assists: 24,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 90,
      points_allowed: 75,
      rebounds: 38,
      assists: 23,
      steals: 8,
      blocks: 5,
    },
  ],

  "Anadolu Efes Istanbul": [
    {
      points_per_game: 90,
      points_allowed: 82,
      rebounds: 36,
      assists: 24,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 37,
      assists: 22,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 87,
      points_allowed: 79,
      rebounds: 35,
      assists: 23,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 89,
      points_allowed: 81,
      rebounds: 38,
      assists: 25,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 91,
      points_allowed: 78,
      rebounds: 36,
      assists: 22,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 92,
      points_allowed: 77,
      rebounds: 39,
      assists: 24,
      steals: 8,
      blocks: 5,
    },
  ],

  "Maccabi Playtica Tel Aviv": [
    {
      points_per_game: 89,
      points_allowed: 80,
      rebounds: 38,
      assists: 22,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 92,
      points_allowed: 78,
      rebounds: 40,
      assists: 24,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 88,
      points_allowed: 81,
      rebounds: 37,
      assists: 23,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 90,
      points_allowed: 79,
      rebounds: 36,
      assists: 21,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 91,
      points_allowed: 77,
      rebounds: 39,
      assists: 24,
      steals: 10,
      blocks: 6,
    },
    {
      points_per_game: 87,
      points_allowed: 80,
      rebounds: 38,
      assists: 22,
      steals: 9,
      blocks: 5,
    },
  ],

  "Panathinaikos AKTOR Athens": [
    {
      points_per_game: 86,
      points_allowed: 82,
      rebounds: 37,
      assists: 21,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 89,
      points_allowed: 80,
      rebounds: 38,
      assists: 22,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 91,
      points_allowed: 78,
      rebounds: 36,
      assists: 24,
      steals: 10,
      blocks: 6,
    },
    {
      points_per_game: 88,
      points_allowed: 81,
      rebounds: 35,
      assists: 23,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 90,
      points_allowed: 79,
      rebounds: 37,
      assists: 22,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 87,
      points_allowed: 80,
      rebounds: 36,
      assists: 21,
      steals: 10,
      blocks: 4,
    },
  ],

  "FC Bayern Munich": [
    {
      points_per_game: 84,
      points_allowed: 83,
      rebounds: 35,
      assists: 20,
      steals: 7,
      blocks: 3,
    },
    {
      points_per_game: 87,
      points_allowed: 81,
      rebounds: 36,
      assists: 21,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 89,
      points_allowed: 79,
      rebounds: 37,
      assists: 22,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 86,
      points_allowed: 82,
      rebounds: 34,
      assists: 20,
      steals: 7,
      blocks: 3,
    },
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 35,
      assists: 21,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 90,
      points_allowed: 78,
      rebounds: 36,
      assists: 23,
      steals: 9,
      blocks: 5,
    },
  ],

  "LDLC ASVEL Villeurbanne": [
    {
      points_per_game: 82,
      points_allowed: 85,
      rebounds: 33,
      assists: 19,
      steals: 6,
      blocks: 2,
    },
    {
      points_per_game: 84,
      points_allowed: 83,
      rebounds: 34,
      assists: 20,
      steals: 7,
      blocks: 3,
    },
    {
      points_per_game: 85,
      points_allowed: 82,
      rebounds: 35,
      assists: 21,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 83,
      points_allowed: 84,
      rebounds: 32,
      assists: 19,
      steals: 7,
      blocks: 3,
    },
    {
      points_per_game: 86,
      points_allowed: 81,
      rebounds: 34,
      assists: 20,
      steals: 6,
      blocks: 3,
    },
    {
      points_per_game: 87,
      points_allowed: 80,
      rebounds: 35,
      assists: 21,
      steals: 8,
      blocks: 4,
    },
  ],
  "EA7 Emporio Armani Milan": [
    {
      points_per_game: 87,
      points_allowed: 80,
      rebounds: 36,
      assists: 22,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 89,
      points_allowed: 79,
      rebounds: 38,
      assists: 23,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 86,
      points_allowed: 81,
      rebounds: 35,
      assists: 21,
      steals: 7,
      blocks: 5,
    },
    {
      points_per_game: 88,
      points_allowed: 78,
      rebounds: 37,
      assists: 22,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 90,
      points_allowed: 77,
      rebounds: 36,
      assists: 24,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 91,
      points_allowed: 76,
      rebounds: 39,
      assists: 25,
      steals: 10,
      blocks: 6,
    },
  ],

  "Partizan Mozzart Bet Belgrade": [
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 37,
      assists: 23,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 90,
      points_allowed: 79,
      rebounds: 38,
      assists: 24,
      steals: 8,
      blocks: 6,
    },
    {
      points_per_game: 89,
      points_allowed: 81,
      rebounds: 36,
      assists: 22,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 87,
      points_allowed: 82,
      rebounds: 35,
      assists: 21,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 91,
      points_allowed: 78,
      rebounds: 39,
      assists: 25,
      steals: 8,
      blocks: 6,
    },
    {
      points_per_game: 92,
      points_allowed: 77,
      rebounds: 40,
      assists: 26,
      steals: 10,
      blocks: 5,
    },
  ],

  "AS Monaco": [
    {
      points_per_game: 89,
      points_allowed: 79,
      rebounds: 36,
      assists: 22,
      steals: 10,
      blocks: 5,
    },
    {
      points_per_game: 91,
      points_allowed: 77,
      rebounds: 38,
      assists: 24,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 37,
      assists: 23,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 90,
      points_allowed: 78,
      rebounds: 39,
      assists: 25,
      steals: 10,
      blocks: 6,
    },
    {
      points_per_game: 87,
      points_allowed: 81,
      rebounds: 36,
      assists: 22,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 92,
      points_allowed: 76,
      rebounds: 40,
      assists: 26,
      steals: 10,
      blocks: 5,
    },
  ],

  "Virtus Segafredo Bologna": [
    {
      points_per_game: 86,
      points_allowed: 82,
      rebounds: 35,
      assists: 21,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 37,
      assists: 23,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 87,
      points_allowed: 81,
      rebounds: 36,
      assists: 22,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 89,
      points_allowed: 79,
      rebounds: 38,
      assists: 24,
      steals: 10,
      blocks: 6,
    },
    {
      points_per_game: 90,
      points_allowed: 78,
      rebounds: 37,
      assists: 23,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 91,
      points_allowed: 77,
      rebounds: 39,
      assists: 25,
      steals: 10,
      blocks: 6,
    },
  ],

  "Crvena Zvezda": [
    {
      points_per_game: 85,
      points_allowed: 83,
      rebounds: 36,
      assists: 21,
      steals: 7,
      blocks: 4,
    },
    {
      points_per_game: 87,
      points_allowed: 81,
      rebounds: 38,
      assists: 22,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 86,
      points_allowed: 82,
      rebounds: 35,
      assists: 20,
      steals: 9,
      blocks: 4,
    },
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 37,
      assists: 23,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 89,
      points_allowed: 79,
      rebounds: 36,
      assists: 22,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 90,
      points_allowed: 78,
      rebounds: 38,
      assists: 24,
      steals: 10,
      blocks: 6,
    },
  ],

  "ALBA Berlin": [
    {
      points_per_game: 84,
      points_allowed: 84,
      rebounds: 34,
      assists: 20,
      steals: 7,
      blocks: 3,
    },
    {
      points_per_game: 86,
      points_allowed: 82,
      rebounds: 36,
      assists: 21,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 85,
      points_allowed: 83,
      rebounds: 35,
      assists: 22,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 87,
      points_allowed: 81,
      rebounds: 36,
      assists: 20,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 88,
      points_allowed: 80,
      rebounds: 37,
      assists: 23,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 89,
      points_allowed: 79,
      rebounds: 38,
      assists: 24,
      steals: 10,
      blocks: 6,
    },
  ],

  "Žalgiris Kaunas": [
    {
      points_per_game: 85,
      points_allowed: 82,
      rebounds: 36,
      assists: 22,
      steals: 8,
      blocks: 4,
    },
    {
      points_per_game: 87,
      points_allowed: 80,
      rebounds: 38,
      assists: 23,
      steals: 9,
      blocks: 5,
    },
    {
      points_per_game: 86,
      points_allowed: 81,
      rebounds: 37,
      assists: 21,
      steals: 10,
      blocks: 4,
    },
    {
      points_per_game: 88,
      points_allowed: 79,
      rebounds: 35,
      assists: 20,
      steals: 8,
      blocks: 5,
    },
    {
      points_per_game: 89,
      points_allowed: 78,
      rebounds: 36,
      assists: 22,
      steals: 9,
      blocks: 6,
    },
    {
      points_per_game: 90,
      points_allowed: 77,
      rebounds: 39,
      assists: 24,
      steals: 10,
      blocks: 5,
    },
  ],
};

export const TeamStats = () => {
  const { teamName } = useParams();
  const navigate = useNavigate();

  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(teamName);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = "http://localhost:5000";

  // Fetch teams from the database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response1 = await fetch(`${BACKEND_URL}/api/teams`);

        if (!response1.ok) {
          throw new Error(`HTTP error! Status: ${response1.status}`);
        }
        const response2 = await fetch(`${BACKEND_URL}/api/players`);

        if (!response2.ok) {
          throw new Error(`HTTP error! Status: ${response2.status}`);
        }

        const data1 = await response1.json();
        const data2 = await response2.json();

        setTeams(data1);
        setPlayers(data2);
        setLoading(false);
      } catch (err) {
        setError(`Error fetching teams data: ${err.message}`);
        console.error("Error details:", err);

        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Access selected team's data
  const selectedTeamData =
    teams.find(
      (team) => team.name.toLowerCase() === selectedTeam.toLowerCase()
    ) || {}; // Default to an empty object if not found

  // Filter players for the selected team
  const filteredPlayers = players.filter(
    (player) =>
      player.team.toLowerCase() === selectedTeamData.name.toLowerCase()
  );

  const sortPlayers = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedPlayers = () => {
    let sortablePlayers = [...filteredPlayers];

    if (!sortConfig.key) return sortablePlayers;

    return sortablePlayers.sort((a, b) => {
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortConfig.key === "number") {
        return sortConfig.direction === "asc"
          ? a.number - b.number
          : b.number - a.number;
      }
      if (sortConfig.key === "position") {
        return sortConfig.direction === "asc"
          ? a.position.localeCompare(b.position)
          : b.position.localeCompare(a.position);
      }
      return 0;
    });
  };

  const getSortDirection = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const filteredData = teams.filter((team) => team.name === selectedTeam);
  console.log(filteredData);

  return (
    <div>
      <h1 className="page-h1">Team {selectedTeam} Statistics</h1>
      <div className="filter-container">
        <div className="filterfield">
          <span style={{ fontSize: "24px" }}>Change Shown Team</span>
          <div className="group-input-follow">
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                navigate(`/TeamStats/${e.target.value}`);
              }}
              className="team-select"
            >
              {teams.map((team) => (
                <option key={team.name} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <input
              className="follow-input"
              type="checkbox"
              id="favorite"
              name="favorite-checkbox"
              defaultValue="favorite-button"
            />
            <label htmlFor="favorite" className="follow-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-heart"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <div className="action">
                <span className="option-1">Follow</span>
                <span className="option-2">Following</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div className="about-team">
        <img
          src={`http://localhost:5000${selectedTeamData.logo}`}
          alt="Description"
        />
        <p>{selectedTeamData.description}</p>
      </div>
      <div className="team-overview">
        <div className="stat-card">
          <h3>Record</h3>
          <p>
            {selectedTeamData.wins} - {selectedTeamData.losses}
          </p>
        </div>
        <div
          className={`stat-card ${
            selectedStat === "pointsPerGame" ? "selected" : ""
          }`}
          onClick={() => setSelectedStat("pointsPerGame")}
        >
          <h3>Points Per Game</h3>
          <p>{selectedTeamData.points_per_game}</p>
        </div>

        <div
          className={`stat-card ${
            selectedStat === "pointsAllowed" ? "selected" : ""
          }`}
          onClick={() => setSelectedStat("pointsAllowed")}
        >
          <h3>Points Allowed</h3>
          <p>{selectedTeamData.points_allowed}</p>
        </div>

        <div
          className={`stat-card ${
            selectedStat === "rebounds" ? "selected" : ""
          }`}
          onClick={() => setSelectedStat("rebounds")}
        >
          <h3>Rebounds</h3>
          <p>{selectedTeamData.rebounds}</p>
        </div>

        <div
          className={`stat-card ${
            selectedStat === "assists" ? "selected" : ""
          }`}
          onClick={() => setSelectedStat("assists")}
        >
          <h3>Assists</h3>
          <p>{selectedTeamData.assists}</p>
        </div>

        <div
          className={`stat-card ${selectedStat === "steals" ? "selected" : ""}`}
          onClick={() => setSelectedStat("steals")}
        >
          <h3>Steals</h3>
          <p>{selectedTeamData.steals}</p>
        </div>

        <div
          className={`stat-card ${selectedStat === "blocks" ? "selected" : ""}`}
          onClick={() => setSelectedStat("blocks")}
        >
          <h3>Blocks</h3>
          <p>{selectedTeamData.blocks}</p>
        </div>
      </div>
      {filteredData.map((team) => {
        // Get the scores data for the team from the teamScores object
        const scores = teamData[team.name] || [];

        return (
          <div key={team.name}>
            {selectedStat && (
              <div className="stat-card-changing">
                {selectedStat === "pointsPerGame" && (
                  <Graphs
                    title="Points Per Game"
                    chartData={scores.map((entry, index) => ({
                      game: `G${index + 1}`,
                      score: entry.points_per_game, // Use steals for the graph
                      result: entry.result,
                    }))}
                    dataKey="score"
                    useResultColor={false}
                  />
                )}
                {selectedStat === "pointsAllowed" && (
                  <Graphs
                    title="Points Allowed"
                    chartData={scores.map((entry, index) => ({
                      game: `G${index + 1}`,
                      score: entry.points_allowed, // Use steals for the graph
                      result: entry.result,
                    }))}
                    dataKey="score"
                    useResultColor={false}
                  />
                )}
                {selectedStat === "rebounds" && (
                  <Graphs
                    title="Rebounds"
                    chartData={scores.map((entry, index) => ({
                      game: `G${index + 1}`,
                      score: entry.rebounds, // Use steals for the graph
                      result: entry.result,
                    }))}
                    dataKey="score"
                    useResultColor={false}
                  />
                )}
                {selectedStat === "assists" && (
                  <Graphs
                    title="Assists"
                    chartData={scores.map((entry, index) => ({
                      game: `G${index + 1}`,
                      score: entry.assists, // Use steals for the graph
                      result: entry.result,
                    }))}
                    dataKey="score"
                    useResultColor={false}
                  />
                )}
                {selectedStat === "steals" && (
                  <Graphs
                    title="Steals"
                    chartData={scores.map((entry, index) => ({
                      game: `G${index + 1}`,
                      score: entry.steals, // Use steals for the graph
                      result: entry.result,
                    }))}
                    dataKey="score"
                    useResultColor={false}
                  />
                )}
                {selectedStat === "blocks" && (
                  <Graphs
                    title="Blocks"
                    chartData={scores.map((entry, index) => ({
                      game: `G${index + 1}`,
                      score: entry.blocks, // Use steals for the graph
                      result: entry.result,
                    }))}
                    dataKey="score"
                    useResultColor={false}
                  />
                )}
              </div>
            )}
            <div className="newest-change">
              <div className="newest-change-card">
                <h2>Latest Change</h2>
                <Graphs
                  title="Assists"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.assists, // Use steals for the graph
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              </div>
              <div className="newest-change-card">
                <h2>Latest Change</h2>
                <Graphs
                  title="Steals"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.steals, // Use steals for the graph
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="newest-change">
        <div className="newest-change-card">
          <h2>Team {selectedTeam} Roster</h2>
          <table>
            <thead>
              <tr>
                <th
                  onClick={() => sortPlayers("name")}
                  className={getSortDirection("name")}
                >
                  Name
                </th>
                <th
                  onClick={() => sortPlayers("number")}
                  className={getSortDirection("number")}
                >
                  Number
                </th>
                <th
                  onClick={() => sortPlayers("position")}
                  className={getSortDirection("position")}
                >
                  Position
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedPlayers().map((player) => (
                <tr key={`${player.name}-${player.number}`}>
                  <td>
                    <a href={`/TeamPlayers/${player.id}`}>{player.name}</a>
                  </td>
                  <td>#{player.number}</td>
                  <td>{player.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*- Upcoming games section 


        <div className="newest-change-card">
          <h2>Upcoming Games</h2>
          <h2>Previous Games</h2>
        </div>
        
        
        -*/}
      </div>
      <BetOverlay />
    </div>
  );
};

export default TeamStats;
