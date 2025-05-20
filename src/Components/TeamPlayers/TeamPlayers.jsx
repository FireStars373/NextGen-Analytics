import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TeamPlayers.css";
import Graphs from "../Graphs/Graphs";
import Tavares from "../Assets/PlayerPhoto/Walter_Tavares.png.png";
import BetOverlay from "../BetOverlay/BetOverlay";

const tempData = {
  "Walter Tavares": [
    {
      min: 24,
      pts: 10,
      ast: 1,
      reb: 14,
      stl: 1,
      blk: 3,
      fg2: 5,
      fg3: 0,
      ft: 0,
      to: 1,
      fouls: 3,
      pir: 15,
    },
    {
      min: 28,
      pts: 12,
      ast: 2,
      reb: 36,
      stl: 0,
      blk: 4,
      fg2: 6,
      fg3: 0,
      ft: 0,
      to: 2,
      fouls: 2,
      pir: 19,
    },
    {
      min: 26,
      pts: 8,
      ast: 0,
      reb: 30,
      stl: 1,
      blk: 2,
      fg2: 4,
      fg3: 0,
      ft: 0,
      to: 1,
      fouls: 3,
      pir: 13,
    },
    {
      min: 30,
      pts: 15,
      ast: 1,
      reb: 28,
      stl: 2,
      blk: 3,
      fg2: 7,
      fg3: 0,
      ft: 1,
      to: 0,
      fouls: 1,
      pir: 22,
    },
    {
      min: 22,
      pts: 6,
      ast: 1,
      reb: 30,
      stl: 0,
      blk: 2,
      fg2: 3,
      fg3: 0,
      ft: 0,
      to: 2,
      fouls: 4,
      pir: 11,
    },
    {
      min: 27,
      pts: 11,
      ast: 2,
      reb: 24,
      stl: 1,
      blk: 5,
      fg2: 5,
      fg3: 0,
      ft: 1,
      to: 1,
      fouls: 2,
      pir: 20,
    },
  ],
};

export const TeamPlayers = () => {
  // Using data from AllTeams.jsx with expanded statistics

  const [selectedPlayer, setSelectedPlayer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedStatOne, setSelectedStatOne] = useState(null);
  const [selectedStatTwo, setSelectedStatTwo] = useState(null);

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { PlayersId } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:5000";
  const [user, setUser] = useState(null);
  const [unlockedFacts, setUnlockedFacts] = useState([]);
  const [purchaseMessage, setPurchaseMessage] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch teams from the database
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response1 = await fetch(`${BACKEND_URL}/api/players`);

        if (!response1.ok) {
          throw new Error(`HTTP error! Status: ${response1.status}`);
        }
        const data1 = await response1.json();

        setPlayers(data1);
        setLoading(false);
      } catch (err) {
        setError(`Error fetching teams data: ${err.message}`);
        console.error("Error details:", err);

        setLoading(false);
      }
    };

    fetchPlayers();
  }, [PlayersId]);

  const selectedDataPlayer =
    players.find((player) => player.id === parseInt(PlayersId)) || {};

  const selectedTeamPlayer = players.filter(
    (player) =>
      player.team.toLowerCase() === selectedDataPlayer.team.toLowerCase()
  );

  const resetSort = () => {
    setSortConfig({ key: null, direction: "asc" });
    setSearchTerm("");
    setSelectedTeam("All");
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === "All" || player.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  const teams = ["All", ...new Set(players.map((player) => player.team))];

  const formatPlayerName = (name) => {
    if (typeof name !== "string") return ""; // Prevents crash if name is undefined/null
    const [firstName, ...lastNames] = name.split(" ");
    const firstInitial = firstName[0];
    const lastName = lastNames.join(" ");
    return `${firstInitial}. ${lastName}`;
  };

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

  const sortPlayers = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedPlayers = () => {
    if (!sortConfig.key) return selectedTeamPlayer;

    return [...selectedTeamPlayer].sort((a, b) => {
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortConfig.key === "team") {
        return sortConfig.direction === "asc"
          ? a.team.localeCompare(b.team)
          : b.team.localeCompare(a.team);
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
      return sortConfig.direction;
    }
    return null;
  };
  const handlePlayerOverview = (player) => {
    navigate(`/TeamPlayers/${player}`);
  };
  const handleTeamOverview = (team) => {
    navigate(`/TeamStats/${team}`);
  };
  const scores = tempData[selectedDataPlayer.name] || [];
  console.log(scores);
  console.log(selectedDataPlayer.photo);

  const handlePurchaseFact = async (factNumber) => {
    if (user.Credit_count > 0) {
      try {
        // Update credits in database
        const response = await fetch(
          `${BACKEND_URL}/api/users/update-credits`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              creditAmount: -1, // Decrease by 1 credit
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update credits");
        }

        // Update local state and localStorage
        const updatedUser = {
          ...user,
          Credit_count: user.Credit_count - 1,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Add fact to unlocked facts
        setUnlockedFacts([...unlockedFacts, factNumber]);
        setPurchaseMessage("Fact unlocked successfully!");
        setTimeout(() => setPurchaseMessage(""), 3000);
      } catch (err) {
        setPurchaseMessage("Error updating credits. Please try again.");
        setTimeout(() => setPurchaseMessage(""), 3000);
      }
    } else {
      setPurchaseMessage(
        "Not enough credits! Please purchase more credits in Settings."
      );
      setTimeout(() => setPurchaseMessage(""), 3000);
    }
  };

  return (
    <div>
      <h1 className="page-h1">
        {formatPlayerName(selectedDataPlayer?.name || "")} Statistics
      </h1>

      {/* Player Profile Section */}
      <div className="player-overview">
        <div className="player-profile">
          <div className="player-photo">
            <img src={Tavares} alt={selectedDataPlayer.name} />
          </div>
          <div className="player-info">
            <h2>{selectedDataPlayer.name}</h2>

            <p onClick={() => handleTeamOverview(selectedDataPlayer.team)}>
              Team: {selectedDataPlayer.team}
            </p>
            <p>Number: #{selectedDataPlayer.number}</p>
            <p>Position: {selectedDataPlayer.position}</p>
            <p>Nationality: {selectedDataPlayer.nationality}</p>
            <p>Date of Birth: {selectedDataPlayer.height}</p>
            <p>Height: {selectedDataPlayer.data_of_birth}</p>
            <div className="player-stats-grid">
              <div className="stats-section">
                <h3>Averages</h3>
                <div className="stat-row">
                  <div
                    className={`stat-item ${
                      selectedStatOne === "min" ? "active" : ""
                    }`}
                    onClick={() => setSelectedStatOne("min")}
                  >
                    <text>MIN</text>
                    <text className="stat-value">
                      {selectedDataPlayer.minutes || 0}
                    </text>
                  </div>
                  <div
                    className={`stat-item ${
                      selectedStatOne === "pts" ? "active" : ""
                    }`}
                    onClick={() => setSelectedStatOne("pts")}
                  >
                    <text>PTS</text>
                    <text className="stat-value">
                      {selectedDataPlayer.points}
                    </text>
                  </div>
                  <div
                    className={`stat-item ${
                      selectedStatOne === "reb" ? "active" : ""
                    }`}
                    onClick={() => setSelectedStatOne("reb")}
                  >
                    <text>REB</text>
                    <text className="stat-value">
                      {selectedDataPlayer.rebounds}
                    </text>
                  </div>
                </div>
                <div className="stat-row">
                  <div
                    className={`stat-item ${
                      selectedStatOne === "ast" ? "active" : ""
                    }`}
                    onClick={() => setSelectedStatOne("ast")}
                  >
                    <text>AST</text>
                    <text className="stat-value">
                      {selectedDataPlayer.assists}
                    </text>
                  </div>
                  <div
                    className={`stat-item ${
                      selectedStatOne === "stl" ? "active" : ""
                    }`}
                    onClick={() => setSelectedStatOne("stl")}
                  >
                    <text>STL</text>
                    <text className="stat-value">
                      {selectedDataPlayer.steals || 0}
                    </text>
                  </div>
                  <div
                    className={`stat-item ${
                      selectedStatOne === "blk" ? "active" : ""
                    }`}
                    onClick={() => setSelectedStatOne("blk")}
                  >
                    <text>BLK</text>
                    <text className="stat-value">
                      {selectedDataPlayer.blocks || 0}
                    </text>
                  </div>
                </div>
              </div>
              {user?.premium_status === 1 && (
                <div className="stats-section">
                  <h3>Shooting</h3>
                  <div className="stat-row">
                    <div
                      className={`stat-item ${
                        selectedStatTwo === "2fg" ? "active" : ""
                      }`}
                      onClick={() => setSelectedStatTwo("2fg")}
                    >
                      <text>2FG%</text>
                      <text className="stat-value">
                        {calculateFG2Percentage(selectedDataPlayer)}%
                      </text>
                    </div>
                    <div
                      className={`stat-item ${
                        selectedStatTwo === "3fg" ? "active" : ""
                      }`}
                      onClick={() => setSelectedStatTwo("3fg")}
                    >
                      <text>3FG%</text>
                      <text className="stat-value">
                        {calculateFG3Percentage(selectedDataPlayer)}%
                      </text>
                    </div>
                    <div
                      className={`stat-item ${
                        selectedStatTwo === "ft" ? "active" : ""
                      }`}
                      onClick={() => setSelectedStatTwo("ft")}
                    >
                      <text>FT%</text>
                      <text className="stat-value">
                        {calculateFTPercentage(selectedDataPlayer)}%
                      </text>
                    </div>
                  </div>
                  <div className="stat-row">
                    <div
                      className={`stat-item ${
                        selectedStatTwo === "to" ? "active" : ""
                      }`}
                      onClick={() => setSelectedStatTwo("to")}
                    >
                      <text>TO</text>
                      <text className="stat-value">
                        {selectedDataPlayer.turnovers || 0}
                      </text>
                    </div>
                    <div
                      className={`stat-item ${
                        selectedStatTwo === "fouls" ? "active" : ""
                      }`}
                      onClick={() => setSelectedStatTwo("fouls")}
                    >
                      <text>FOULS</text>
                      <text className="stat-value">
                        {selectedDataPlayer.fouls_received
                          ? selectedDataPlayer.fouls_committed
                          : 0}
                      </text>
                    </div>
                    <div
                      className={`stat-item ${
                        selectedStatTwo === "pir" ? "active" : ""
                      }`}
                      onClick={() => setSelectedStatTwo("pir")}
                    >
                      <text>PIR</text>
                      <text className="stat-value">
                        {selectedDataPlayer.pir || 0}
                      </text>
                    </div>
                  </div>
                </div>
              )}

              {!user?.premium_status && (
                <div
                  className="stats-section"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ borderBottom: "3px solid #00b7ff" }}>
                    Premium Feature
                  </h3>
                  <p>
                    Upgrade to Premium to see detailed shooting statistics and
                    performance graphs!
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
            </div>
          </div>
        </div>
        <div className="player-graphs">
          {/* First graph section - Basic stats (visible to all users) */}
          <div className="player-graph-one">
            {selectedStatOne === "min" && (
              <Graphs
                title="MIN"
                chartData={scores.map((entry, index) => ({
                  game: `G${index + 1}`,
                  score: entry.min,
                  result: entry.result,
                }))}
                dataKey="score"
                useResultColor={false}
              />
            )}
            {selectedStatOne === "pts" && (
              <Graphs
                title="PTS"
                chartData={scores.map((entry, index) => ({
                  game: `G${index + 1}`,
                  score: entry.pts,
                  result: entry.result,
                }))}
                dataKey="score"
                useResultColor={false}
              />
            )}
            {selectedStatOne === "reb" && (
              <Graphs
                title="REB"
                chartData={scores.map((entry, index) => ({
                  game: `G${index + 1}`,
                  score: entry.reb,
                  result: entry.result,
                }))}
                dataKey="score"
                useResultColor={false}
              />
            )}
            {selectedStatOne === "ast" && (
              <Graphs
                title="AST"
                chartData={scores.map((entry, index) => ({
                  game: `G${index + 1}`,
                  score: entry.ast,
                  result: entry.result,
                }))}
                dataKey="score"
                useResultColor={false}
              />
            )}
            {selectedStatOne === "stl" && (
              <Graphs
                title="STL"
                chartData={scores.map((entry, index) => ({
                  game: `G${index + 1}`,
                  score: entry.stl,
                  result: entry.result,
                }))}
                dataKey="score"
                useResultColor={false}
              />
            )}
            {selectedStatOne === "blk" && (
              <Graphs
                title="BLK"
                chartData={scores.map((entry, index) => ({
                  game: `G${index + 1}`,
                  score: entry.blk,
                  result: entry.result,
                }))}
                dataKey="score"
                useResultColor={false}
              />
            )}
            {!selectedStatOne && (
              <div>
                <center>
                  <h2>Latest Change</h2>
                </center>
                <Graphs
                  title="MIN"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.min,
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              </div>
            )}
          </div>

          {/* Second graph section - Detailed stats (premium only) */}
          {user?.premium_status === 1 ? (
            <div className="player-graph-one">
              {selectedStatTwo === "2fg" && (
                <Graphs
                  title="2FG"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.fg2,
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              )}
              {selectedStatTwo === "3fg" && (
                <Graphs
                  title="3FG"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.fg3,
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              )}
              {selectedStatTwo === "ft" && (
                <Graphs
                  title="FT"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.ft,
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              )}
              {selectedStatTwo === "to" && (
                <Graphs
                  title="TO"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.to,
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              )}
              {selectedStatTwo === "fouls" && (
                <Graphs
                  title="FOULS"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.fouls,
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              )}
              {selectedStatTwo === "pir" && (
                <Graphs
                  title="PIR"
                  chartData={scores.map((entry, index) => ({
                    game: `G${index + 1}`,
                    score: entry.pir,
                    result: entry.result,
                  }))}
                  dataKey="score"
                  useResultColor={false}
                />
              )}
              {!selectedStatTwo && (
                <div>
                  <center>
                    <h2>Latest Change</h2>
                  </center>
                  <Graphs
                    title="FT"
                    chartData={scores.map((entry, index) => ({
                      game: `G${index + 1}`,
                      score: entry.ft,
                      result: entry.result,
                    }))}
                    dataKey="score"
                    useResultColor={false}
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              className="player-graph-one"
              style={{
                textAlign: "center",
              }}
            >
              <h3 style={{ borderBottom: "3px solid #00b7ff" }}>
                Premium Feature
              </h3>
              <p>
                Upgrade to Premium to see detailed shooting and performance
                statistics!
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
        </div>
      </div>

      <div className="interesting-facts">
        <h3 style={{ fontSize: "32px" }}>Did you know?</h3>
        {purchaseMessage && (
          <div
            className={
              purchaseMessage.includes("Not enough")
                ? "error-message"
                : "success-message"
            }
            style={{ textAlign: "center", margin: "10px 0" }}
          >
            {purchaseMessage}
          </div>
        )}
        <div className="facts-container">
          <div className="fact">
            <h3>Fact 1:</h3>
            <p>
              Walter Tavares, standing at 7'3" (221 cm), is known as a
              basketball giant, but off the court, he's considered one of the
              nicest, most down-to-earth players. Despite his intimidating size,
              teammates often describe him as a "gentle giant." He's more likely
              to help someone with their bags than dunk on them.
            </p>
          </div>
          {user?.premium_status === 1 || unlockedFacts.includes(2) ? (
            <div className="fact">
              <h3>Fact 2:</h3>
              <p>
                Walter's wingspan is rumored to be around 7'9" (236 cm). It's so
                long that when he reaches out to grab a basketball, it's like
                he's in a different zip code. The guy doesn't need a ladder to
                dunk; he just reaches the basket like he's picking fruit from a
                tree.
              </p>
            </div>
          ) : (
            <div className="fact" style={{ opacity: 0.7, textAlign: "center" }}>
              <h3>Fact 2 (Locked)</h3>
              <p style={{ filter: "blur(5px)" }}>
                Walter's wingspan is rumored to be around 7'9" (236 cm). It's so
                long that when he reaches out to grab a basketball, it's like
                he's in a different zip code. The guy doesn't need a ladder to
                dunk; he just reaches the basket like he's picking fruit from a
                tree.
              </p>
              <button
                className="submit-button"
                onClick={() => handlePurchaseFact(2)}
              >
                Unlock with 1 Credit ({user?.Credit_count || 0} credits
                available)
              </button>
            </div>
          )}
          {user?.premium_status === 1 || unlockedFacts.includes(3) ? (
            <div className="fact">
              <h3>Fact 3:</h3>
              <p>
                Tavares is known for his exceptional basketball IQ, but fans
                sometimes get a glimpse of his "other talents" off the court. If
                you check out his social media, you might see a dance move or
                two that'll have you wondering if he's preparing for a future in
                both basketball and salsa.
              </p>
            </div>
          ) : (
            <div className="fact" style={{ opacity: 0.7, textAlign: "center" }}>
              <h3>Fact 3 (Locked)</h3>
              <p style={{ filter: "blur(5px)" }}>
                Tavares is known for his exceptional basketball IQ, but fans
                sometimes get a glimpse of his "other talents" off the court. If
                you check out his social media, you might see a dance move or
                two that'll have you wondering if he's preparing for a future in
                both basketball and salsa.
              </p>
              <button
                className="submit-button"
                onClick={() => handlePurchaseFact(3)}
              >
                Unlock with 1 Credit ({user?.Credit_count || 0} credits
                available)
              </button>
            </div>
          )}
          {!user?.premium_status && !unlockedFacts.length && (
            <div
              className="fact"
              style={{
                textAlign: "center",
              }}
            >
              <h3>Premium Feature</h3>
              <p>
                Upgrade to Premium to see all facts about players or use credits
                to unlock individual facts!
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
        </div>
      </div>

      <center>
        <h2 style={{ fontSize: "42px" }}>
          Other Team {selectedDataPlayer.team} Members
        </h2>
      </center>
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
              onClick={() => sortPlayers("team")}
              className={getSortDirection("team")}
            >
              Team
            </th>
            <th
              onClick={() => sortPlayers("number")}
              className={getSortDirection("number")}
            >
              #
            </th>
            <th
              onClick={() => sortPlayers("position")}
              className={getSortDirection("position")}
            >
              POS
            </th>
          </tr>
        </thead>
        <tbody>
          {getSortedPlayers().map((player) => (
            <tr
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className={selectedDataPlayer.id === player.id ? "selected" : ""}
            >
              <td onClick={() => handlePlayerOverview(player.id)}>
                {player.name}
              </td>

              <td onClick={() => handleTeamOverview(player.team)}>
                {player.team}
              </td>
              <td>#{player.number}</td>
              <td>{player.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BetOverlay />
    </div>
  );
};

export default TeamPlayers;
