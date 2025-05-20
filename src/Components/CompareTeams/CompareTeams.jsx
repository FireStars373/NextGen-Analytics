import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BetOverlay from "../BetOverlay/BetOverlay";
import "./CompareTeams.css";

const CompareTeams = () => {
  const { team1Name, team2Name } = useParams();
  const navigate = useNavigate();
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = "http://localhost:5000"; // Change this port if your backend uses a different one

  useEffect(() => {
    const fetchTeamsData = async () => {
      if (!team1Name || !team2Name) {
        navigate("/AllTeams");
        return;
      }

      setLoading(true);

      try {
        // Fetch first team
        const response1 = await fetch(
          `${BACKEND_URL}/api/teams/name/${team1Name}`
        );
        if (!response1.ok) {
          throw new Error(`Error fetching ${team1Name}: ${response1.status}`);
        }

        // Fetch second team
        const response2 = await fetch(
          `${BACKEND_URL}/api/teams/name/${team2Name}`
        );
        if (!response2.ok) {
          throw new Error(`Error fetching ${team2Name}: ${response2.status}`);
        }

        const data1 = await response1.json();
        const data2 = await response2.json();

        setTeam1(data1);
        setTeam2(data2);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError(`Error loading teams data: ${err.message}`);

        // Use mock data for testing
        setTeam1(mockTeamsData[team1Name] || createDefaultTeam(team1Name));
        setTeam2(mockTeamsData[team2Name] || createDefaultTeam(team2Name));
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, [team1Name, team2Name, navigate]);

  // Create a default team object for fallback
  const createDefaultTeam = (name) => ({
    name: name,
    wins: 0,
    losses: 0,
    points_per_game: 0,
    points_allowed: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    league: "Unknown",
  });

  // Mock data for testing
  const mockTeamsData = {
    "Žalgiris Kaunas": {
      name: "Žalgiris Kaunas",
      league: "LKL",
      wins: 15,
      losses: 5,
      points_per_game: 85.6,
      points_allowed: 78.2,
      rebounds: 36.8,
      assists: 18.5,
      steals: 6.2,
      blocks: 3.8,
    },
    "Rytas Vilnius": {
      name: "Rytas Vilnius",
      league: "LKL",
      wins: 12,
      losses: 8,
      points_per_game: 82.3,
      points_allowed: 80.1,
      rebounds: 35.2,
      assists: 17.8,
      steals: 7.1,
      blocks: 2.9,
    },
  };

  // Helper function to determine which team has better stats
  const getBetterTeam = (stat) => {
    if (!team1 || !team2) return null;

    // For these stats, higher is better
    const higherIsBetter = [
      "wins",
      "points_per_game",
      "rebounds",
      "assists",
      "steals",
      "blocks",
    ];

    // For these stats, lower is better
    const lowerIsBetter = ["losses", "points_allowed"];

    if (higherIsBetter.includes(stat)) {
      if (team1[stat] > team2[stat]) return "team1";
      if (team1[stat] < team2[stat]) return "team2";
      return "equal";
    }

    if (lowerIsBetter.includes(stat)) {
      if (team1[stat] < team2[stat]) return "team1";
      if (team1[stat] > team2[stat]) return "team2";
      return "equal";
    }

    return "equal";
  };

  if (loading) return <div className="loading">Loading comparison data...</div>;
  if (error)
    return (
      <div className="error">
        {error} <p>Using mock data for display.</p>
      </div>
    );
  if (!team1 || !team2)
    return <div className="error">Teams data not available</div>;

  return (
    <div>
      <h1 className="page-h1">Team Comparison</h1>
      <div className="compare-teams-container">
        <div className="teams-header">
          <div className="team1-header">{team1.name}</div>
          <div className="stat-label">Statistic</div>
          <div className="team2-header">{team2.name}</div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("wins") === "team1" ? "better" : ""
            }`}
          >
            {team1.wins}
          </div>
          <div className="stat-name">Wins</div>
          <div
            className={`team2-stat ${
              getBetterTeam("wins") === "team2" ? "better" : ""
            }`}
          >
            {team2.wins}
          </div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("losses") === "team1" ? "better" : ""
            }`}
          >
            {team1.losses}
          </div>
          <div className="stat-name">Losses</div>
          <div
            className={`team2-stat ${
              getBetterTeam("losses") === "team2" ? "better" : ""
            }`}
          >
            {team2.losses}
          </div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("points_per_game") === "team1" ? "better" : ""
            }`}
          >
            {team1.points_per_game}
          </div>
          <div className="stat-name">Points Per Game</div>
          <div
            className={`team2-stat ${
              getBetterTeam("points_per_game") === "team2" ? "better" : ""
            }`}
          >
            {team2.points_per_game}
          </div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("points_allowed") === "team1" ? "better" : ""
            }`}
          >
            {team1.points_allowed}
          </div>
          <div className="stat-name">Points Allowed</div>
          <div
            className={`team2-stat ${
              getBetterTeam("points_allowed") === "team2" ? "better" : ""
            }`}
          >
            {team2.points_allowed}
          </div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("rebounds") === "team1" ? "better" : ""
            }`}
          >
            {team1.rebounds}
          </div>
          <div className="stat-name">Rebounds</div>
          <div
            className={`team2-stat ${
              getBetterTeam("rebounds") === "team2" ? "better" : ""
            }`}
          >
            {team2.rebounds}
          </div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("assists") === "team1" ? "better" : ""
            }`}
          >
            {team1.assists}
          </div>
          <div className="stat-name">Assists</div>
          <div
            className={`team2-stat ${
              getBetterTeam("assists") === "team2" ? "better" : ""
            }`}
          >
            {team2.assists}
          </div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("steals") === "team1" ? "better" : ""
            }`}
          >
            {team1.steals}
          </div>
          <div className="stat-name">Steals</div>
          <div
            className={`team2-stat ${
              getBetterTeam("steals") === "team2" ? "better" : ""
            }`}
          >
            {team2.steals}
          </div>
        </div>

        <div className="comparison-row">
          <div
            className={`team1-stat ${
              getBetterTeam("blocks") === "team1" ? "better" : ""
            }`}
          >
            {team1.blocks}
          </div>
          <div className="stat-name">Blocks</div>
          <div
            className={`team2-stat ${
              getBetterTeam("blocks") === "team2" ? "better" : ""
            }`}
          >
            {team2.blocks}
          </div>
        </div>

        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate("/AllTeams")}>
            Back to Teams
          </button>
        </div>
      </div>
      <BetOverlay />
    </div>
  );
};

export default CompareTeams;
