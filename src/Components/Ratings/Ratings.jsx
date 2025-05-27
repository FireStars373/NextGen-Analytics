import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, Minus, X } from "lucide-react";
import "./Ratings.css";
import getTopPlayers from "../MainPage/GetTopPlayers";
import calculateEfficiencyRating from "../MainPage/CalculateEfficientyPlayers";
import BetOverlay from "../BetOverlay/BetOverlay";
import "../CompareTeams/CompareTeams.css";

export const Ratings = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [user, setUser] = useState(null);

  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: "efficiencyRating",
    direction: "desc",
  });

  const navigate = useNavigate();
  const formattedDate = new Date().toISOString().split("T")[0];

  const BACKEND_URL = "http://localhost:5000";

  // Fetch players from the database
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/players`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPlayers(data);
        setLoading(false);
      } catch (err) {
        setError(`Error fetching players data: ${err.message}`);
        console.error("Error details:", err);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Function to handle player selection for comparison
  const handlePlayerSelect = (player) => {
    if (selectedPlayers.some((p) => p.id === player.id)) {
      // If player is already selected, remove from selection
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else if (selectedPlayers.length < 2) {
      // If less than 2 players are selected, add to selection
      setSelectedPlayers([...selectedPlayers, player]);
    } else {
      // If 2 players already selected, replace the first one
      setSelectedPlayers([selectedPlayers[1], player]);
    }
  };

  // Function to handle comparison button click
  const handleCompare = () => {
    if (selectedPlayers.length === 2) {
      setIsCompareModalOpen(true);
    }
  };
  // Function to close the comparison modal
  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  // First, attach efficiencyRating to each player
  const playersWithERR = players.map((player) => ({
    ...player,
    efficiencyRating: parseFloat(calculateEfficiencyRating(player)),
  }));

  // Then, sort and rank them safely
  const rankedPlayers = [...playersWithERR]
    .sort((a, b) => b.efficiencyRating - a.efficiencyRating)
    .map((player, index) => ({
      ...player,
      rankByERR: index + 1, // Rank starts from 1
    }));

  // Filter players based on premium status
  const filteredPlayers = rankedPlayers.filter((player, index) => {
    // If user is premium, show all players
    if (user?.premium_status === 1) {
      return true;
    }
    // If free user, only show players ranked 40-50
    return index >= 39 && index < 50;
  });

  // Filtering
  const filtered = filteredPlayers
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = selectedTeam === "all" || p.team === selectedTeam;
      const matchesPosition =
        positionFilter === "all" || p.position === positionFilter;

      return matchesSearch && matchesTeam && matchesPosition;
    })
    .slice(0, 50);

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let aValue, bValue;

    if (sortConfig.key === "name") {
      aValue = a.name;
      bValue = b.name;
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (sortConfig.key === "team") {
      aValue = a.team;
      bValue = b.team;
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (sortConfig.key === "efficiencyRating") {
      aValue = parseFloat(calculateEfficiencyRating(a));
      bValue = parseFloat(calculateEfficiencyRating(b));
    } else {
      // Other sorting options
      aValue =
        sortConfig.key === "number" ? a.number : a.stats[sortConfig.key] || 0;
      bValue =
        sortConfig.key === "number" ? b.number : b.stats[sortConfig.key] || 0;
    }

    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Top 3 players
  const top3 = getTopPlayers(players, 3);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const handleTeamClick = (team) => navigate(`/TeamStats/${team}`);
  const handlePlayerClick = (player) => navigate(`/TeamPlayers/${player}`);

  //------------------------------------------------------------------------------------
  // Calculate 2FG, 3FG, and FT percentages
  const calculateFG2Percentage = (player) => {
    const { fg2_attempts, fg2_made } = player;
    return fg2_attempts > 0
      ? ((fg2_made / fg2_attempts) * 100).toFixed(1)
      : "0.0";
  };

  const calculateFG3Percentage = (player) => {
    const { fg3_attempts, fg3_made } = player;
    return fg3_attempts > 0
      ? ((fg3_made / fg3_attempts) * 100).toFixed(1)
      : "0.0";
  };

  const calculateFTPercentage = (player) => {
    const { ft_attempts, ft_made } = player;
    return ft_attempts > 0 ? ((ft_made / ft_attempts) * 100).toFixed(1) : "0.0";
  };

  // Check if player is selected
  const isPlayerSelected = (playerId) => {
    return selectedPlayers.some((player) => player.id === playerId);
  };

  // Helper function to determine which team has better stats
  const getBetterTeam = (stat) => {
    if (!selectedPlayers[0] || !selectedPlayers[1]) return null;

    // For these stats, higher is better
    const higherIsBetter = [
      "minutes",
      "points",
      "rebounds",
      "assists",
      "steals",
      "blocks",
      "fg2",
      "fg3",
      "ft",
      "efficienty",
    ];

    // For these stats, lower is better
    const lowerIsBetter = ["turnovers", "fouls"];

    if (higherIsBetter.includes(stat)) {
      if (selectedPlayers[0][stat] > selectedPlayers[1][stat]) return "player1";
      if (selectedPlayers[0][stat] < selectedPlayers[1][stat]) return "player2";
      return "equal";
    }

    if (lowerIsBetter.includes(stat)) {
      if (selectedPlayers[0][stat] < selectedPlayers[1][stat]) return "player1";
      if (selectedPlayers[0][stat] > selectedPlayers[1][stat]) return "player2";
      return "equal";
    }
    return "equal";
  };
  const getBetterFG2 = () => {
    const p1 = parseFloat(calculateFG2Percentage(selectedPlayers[0]));
    const p2 = parseFloat(calculateFG2Percentage(selectedPlayers[1]));

    if (p1 > p2) return "player1";
    if (p1 < p2) return "player2";
    return "equal";
  };
  const getBetterFG3 = () => {
    const p1 = parseFloat(calculateFG3Percentage(selectedPlayers[0]));
    const p2 = parseFloat(calculateFG3Percentage(selectedPlayers[1]));

    if (p1 > p2) return "player1";
    if (p1 < p2) return "player2";
    return "equal";
  };
  const getBetterFT = () => {
    const p1 = parseFloat(calculateFTPercentage(selectedPlayers[0]));
    const p2 = parseFloat(calculateFTPercentage(selectedPlayers[1]));

    if (p1 > p2) return "player1";
    if (p1 < p2) return "player2";
    return "equal";
  };
  const getBetterFouls = () => {
    const p1 = parseFloat(
      selectedPlayers[0].fouls_committed ? selectedPlayers[0].fouls_received : 0
    );
    const p2 = parseFloat(
      selectedPlayers[1].fouls_committed ? selectedPlayers[1].fouls_received : 0
    );

    if (p1 > p2) return "player1";
    if (p1 < p2) return "player2";
    return "equal";
  };
  const getBetterEfficiency = () => {
    const p1 = parseFloat(calculateEfficiencyRating(selectedPlayers[0]));
    const p2 = parseFloat(calculateEfficiencyRating(selectedPlayers[1]));

    if (p1 > p2) return "player1";
    if (p1 < p2) return "player2";
    return "equal";
  };

  // Render the comparison modal
  const renderComparisonModal = () => {
    if (!isCompareModalOpen || selectedPlayers.length !== 2) return null;

    const player1 = selectedPlayers[0];
    const player2 = selectedPlayers[1];

    return (
      <div className="comparison-modal-overlay">
        <div className="comparison-modal">
          <div className="comparison-modal-header">
            <h2>Player Comparison</h2>
            <X
              className="close-modal-button"
              size={32}
              onClick={closeCompareModal}
            />
          </div>

          {/* Player 1 Column */}
          <div className="player-container">
            <div className="player-header">
              <div className="player-photo-container">
                <img
                  src={`http://localhost:5000${player1.photo}`}
                  alt={player1.name}
                />
              </div>
              <div className="player-details">
                <h3>{player1.name}</h3>
                <p>
                  {player1.team} | #{player1.number} | {player1.position}
                </p>
              </div>
            </div>

            {/* Player 2 Column */}
            <div className="player-header">
              <div className="player-photo-container">
                <img
                  src={`http://localhost:5000${player2.photo}`}
                  alt={player2.name}
                />
              </div>
              <div className="player-details">
                <h3>{player2.name}</h3>
                <p>
                  {player2.team} | #{player2.number} | {player2.position}
                </p>
              </div>
            </div>
          </div>

          <div className="comparison-content">
            <h3>Basic Stats</h3>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterTeam("minutes") === "player1" ? "better" : ""
                }`}
              >
                {player1.minutes}
              </div>
              <div className="stat-name">Minutes</div>
              <div
                className={`team2-stat ${
                  getBetterTeam("minutes") === "player2" ? "better" : ""
                }`}
              >
                {player2.minutes}
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterTeam("points") === "player1" ? "better" : ""
                }`}
              >
                {player1.points}
              </div>
              <div className="stat-name">Points</div>
              <div
                className={`team2-stat ${
                  getBetterTeam("points") === "player2" ? "better" : ""
                }`}
              >
                {player2.points}
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterTeam("rebounds") === "player1" ? "better" : ""
                }`}
              >
                {player1.rebounds}
              </div>
              <div className="stat-name">Rebounds</div>
              <div
                className={`team2-stat ${
                  getBetterTeam("rebounds") === "player2" ? "better" : ""
                }`}
              >
                {player2.rebounds}
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterTeam("assists") === "player1" ? "better" : ""
                }`}
              >
                {player1.assists}
              </div>
              <div className="stat-name">Assists</div>
              <div
                className={`team2-stat ${
                  getBetterTeam("assists") === "player2" ? "better" : ""
                }`}
              >
                {player2.assists}
              </div>
            </div>

            <h3 style={{ paddingTop: "100px" }}>Advances Stats</h3>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterTeam("steals") === "player1" ? "better" : ""
                }`}
              >
                {player1.steals}
              </div>
              <div className="stat-name">Steals</div>
              <div
                className={`team2-stat ${
                  getBetterTeam("steals") === "player2" ? "better" : ""
                }`}
              >
                {player2.steals}
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterTeam("blocks") === "player1" ? "better" : ""
                }`}
              >
                {player1.blocks}
              </div>
              <div className="stat-name">Blocks</div>
              <div
                className={`team2-stat ${
                  getBetterTeam("blocks") === "player2" ? "better" : ""
                }`}
              >
                {player2.blocks}
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterTeam("turnovers") === "player1" ? "better" : ""
                }`}
              >
                {player1.turnovers}
              </div>
              <div className="stat-name">Turnovers</div>
              <div
                className={`team2-stat ${
                  getBetterTeam("turnovers") === "player2" ? "better" : ""
                }`}
              >
                {player2.turnovers}
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterFouls("fouls") === "player1" ? "better" : ""
                }`}
              >
                {player1.fouls_committed ? player1.fouls_received : 0}
              </div>
              <div className="stat-name">Fouls</div>
              <div
                className={`team2-stat ${
                  getBetterFouls("fouls") === "player2" ? "better" : ""
                }`}
              >
                {player2.fouls_committed ? player2.fouls_received : 0}
              </div>
            </div>

            <h3 style={{ paddingTop: "100px" }}>Shooting Stats</h3>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterFG2() === "player1" ? "better" : ""
                }`}
              >
                {calculateFG2Percentage(player1)}%
              </div>
              <div className="stat-name">2FG%</div>
              <div
                className={`team2-stat ${
                  getBetterFG2() === "player2" ? "better" : ""
                }`}
              >
                {calculateFG2Percentage(player2)}%
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterFG3() === "player1" ? "better" : ""
                }`}
              >
                {calculateFG3Percentage(player1)}%
              </div>
              <div className="stat-name">3FG%</div>
              <div
                className={`team2-stat ${
                  getBetterFG3() === "player2" ? "better" : ""
                }`}
              >
                {calculateFG3Percentage(player2)}%
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterFT() === "player1" ? "better" : ""
                }`}
              >
                {calculateFTPercentage(player1)}%
              </div>
              <div className="stat-name">FT%</div>
              <div
                className={`team2-stat ${
                  getBetterFT() === "player2" ? "better" : ""
                }`}
              >
                {calculateFTPercentage(player2)}%
              </div>
            </div>
            <div className="comparison-row">
              <div
                className={`team1-stat ${
                  getBetterEfficiency() === "player1" ? "better" : ""
                }`}
              >
                {calculateEfficiencyRating(player1)}
              </div>
              <div className="stat-name">Efficiency</div>
              <div
                className={`team2-stat ${
                  getBetterEfficiency() === "player2" ? "better" : ""
                }`}
              >
                {calculateEfficiencyRating(player2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  //------------------------------------------------------------------------------------
  return (
    <div>
      <h1 className="page-h1">Most Efficient Players</h1>

      {/* Show premium upgrade message for free users */}
      {user?.premium_status !== 1 && (
        <div
          className="player-graph-one"
          style={{
            margin: "20px auto",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <h3 style={{ borderBottom: "3px solid #00b7ff" }}>Premium Feature</h3>
          <p>
            Free users can only view players ranked 40-50. Upgrade to Premium to
            see all player rankings!
          </p>
          <button
            className="submit-button"
            style={{ marginTop: "10px" }}
            onClick={() => navigate("/Settings")}
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Show top 3 players only for premium users */}
      {user?.premium_status === 1 && (
        <div className="ratings-container">
          <div className="top-players-section">
            <div className="top-players">
              {top3.map((player, idx) => {
                return (
                  <div
                    key={player.id}
                    className="top-player-card"
                    style={{
                      boxShadow:
                        "15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60)",
                    }}
                    onClick={() => handlePlayerClick(player.id)}
                  >
                    <div className="top-player-rank">{idx + 1}</div>
                    <div className="top-player-photo">
                      <img
                        style={{ width: "130px" }}
                        src={`http://localhost:5000${player.photo}`}
                        alt={`${player.name} photo`}
                      />
                    </div>
                    <div className="top-player-info">
                      <center>
                        <h3 style={{ fontSize: "32px" }}>{player.name}</h3>
                        <p style={{ opacity: "50%" }}>
                          {player.team} | {player.position}
                        </p>
                        <div className="top-player-stats">
                          <div className="stat">
                            <text>MIN</text>
                            <text className="stat-value">
                              {player.minutes || 0}
                            </text>
                          </div>
                          <div className="stat">
                            <text>PTS</text>
                            <text className="stat-value">{player.points}</text>
                          </div>
                          <div className="stat-highlight">
                            <text style={{ fontWeight: "bold" }}>ERR</text>
                            <text className="stat-value">
                              {calculateEfficiencyRating(player)}
                            </text>
                          </div>
                        </div>
                      </center>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Button - Show only when 2 players are selected */}
      {selectedPlayers.length === 2 && (
        <div className="comparison-button-container">
          <button className="comparison-button" onClick={handleCompare}>
            Compare {selectedPlayers[0].name} vs {selectedPlayers[1].name}
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th style={{ fontSize: "24px", padding: "15px", width: "30px" }}>
              Nr.
            </th>
            <th style={{ fontSize: "24px", padding: "15px", width: "120px" }}>
              Change
            </th>
            <th
              style={{ fontSize: "24px", padding: "15px" }}
              onClick={() => handleSort("name")}
            >
              Player {getSortIcon("name")}
            </th>
            <th
              style={{ fontSize: "24px", padding: "15px" }}
              onClick={() => handleSort("team")}
            >
              Team {getSortIcon("team")}
            </th>
            <th
              style={{ fontSize: "24px", padding: "15px" }}
              onClick={() => handleSort("efficiencyRating")}
            >
              ERR {getSortIcon("efficiencyRating")}
            </th>
            <th style={{ fontSize: "24px", padding: "15px" }}>Compare</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((player, index) => (
            <tr
              key={player.id}
              className={isPlayerSelected(player.id) ? "selected-player" : ""}
            >
              <td>{player.rankByERR}.</td>
              <td>
                <center>
                  <Minus />
                </center>
              </td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => handlePlayerClick(player.id)}
              >
                {player.name}
              </td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => handleTeamClick(player.team)}
              >
                {player.team}
              </td>
              <td className="efficiency-rating">
                {calculateEfficiencyRating(player)}
              </td>
              <td>
                <button
                  className={`select-button ${
                    isPlayerSelected(player.id) ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayerSelect(player);
                  }}
                >
                  {isPlayerSelected(player.id) ? "Selected" : "Select"}
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={8}>
              <p
                style={{
                  fontSize: "24px",
                  width: "100%",
                  textAlign: "right",
                  color: "white",
                  padding: "8px", // optional for better spacing
                }}
              >
                Ratings data last updated: <strong>{formattedDate}</strong>
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="formula-explanation">
        <h3>Efficiency Rating Formula (ERR)</h3>
        <text>
          ERR = ((2 × PTS) + REB + (1.5 × AST) + STL + BLK - MIS - TO - FTM) /
          MIN
        </text>
        <p>Where:</p>
        <ul>
          <li>PTS - points</li>
          <li>REB - rebounds</li>
          <li>AST - assists</li>
          <li>STL - steals</li>
          <li>BLK - blocks</li>
          <li>MIS - missed shots</li>
          <li>TO - turnovers</li>
          <li>FTM - missed free throws</li>
          <li>MIN - minutes played</li>
        </ul>
        <p>
          The higher the ERR, the more efficient and productive the player is.
        </p>
      </div>
      {renderComparisonModal()}
      <BetOverlay />
    </div>
  );
};
