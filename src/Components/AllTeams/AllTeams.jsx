import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Schedule/Schedule.css";
import "./AllTeams.css";
import Graphs from "../Graphs/AllTeamsGraph";
import BetOverlay from "../BetOverlay/BetOverlay";

// Team score data with win/loss results
const teamScores = {
  "Anadolu Efes Istanbul": [
    { score: 81, score1: 70, result: "W", result1: "L" },
    { score: 76, score1: 74, result: "L", result1: "W" },
    { score: 88, score1: 77, result: "W", result1: "L" },
    { score: 79, score1: 90, result: "L", result1: "W" },
    { score: 90, score1: 60, result: "W", result1: "L" },
    { score: 84, score1: 75, result: "W", result1: "L" },
  ],
  "FC Barcelona": [
    { score: 81, score1: 70, result: "W", result1: "L" },
    { score: 76, score1: 74, result: "L", result1: "W" },
    { score: 88, score1: 77, result: "W", result1: "L" },
    { score: 79, score1: 90, result: "L", result1: "W" },
    { score: 90, score1: 60, result: "W", result1: "L" },
    { score: 84, score1: 75, result: "W", result1: "L" },
  ],
};

export const AllTeams = () => {
  const navigate = useNavigate();

  //----------------------------------------------------//
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // Backend URL
  const BACKEND_URL = "http://localhost:5000";

  // Fetch teams from the database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/teams`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (err) {
        setError(`Error fetching teams data: ${err.message}`);
        console.error("Error details:", err);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const leagues = ["All Leagues", "LKL", "Euroleague"];

  // States for filtering
  const [searchTeam, setSearchTeam] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");

  const toggleTeamSelection = (team, event) => {
    event.stopPropagation(); // Prevent triggering the card click

    if (selectedTeams.some((t) => t.id === team.id)) {
      // If team is already selected, remove it
      setSelectedTeams(selectedTeams.filter((t) => t.id !== team.id));
    } else {
      // If team is not selected, add it (but limit to 2 teams)
      if (selectedTeams.length < 2) {
        setSelectedTeams([...selectedTeams, team]);
      } else {
        // If already 2 teams selected, replace the first one
        setSelectedTeams([selectedTeams[1], team]);
      }
    }
  };

  const compareTeams = () => {
    if (selectedTeams.length === 2) {
      navigate(
        `/CompareTeams/${selectedTeams[0].name}/${selectedTeams[1].name}`
      );
    }
  };

  const filteredData = teams.filter((team) => {
    const matchTeam =
      searchTeam === "" ||
      team.name.toLowerCase().includes(searchTeam.toLowerCase());

    const matchLeague =
      selectedLeague === "All Leagues" || team.league === selectedLeague;

    return matchTeam && matchLeague;
  });
  console.log(filteredData);

  //----------------------------------------------------//

  const handleTeamRedirect = (teamName) => {
    navigate(`/TeamStats/${teamName}`);
  };

  return (
    <div>
      <h1 className="page-h1">EuroLeagues Teams</h1>

      <div className="filter-container">
        <div className="filter-field">
          <span style={{ fontSize: "24px" }}>Select League</span>
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
          >
            {leagues.map((league) => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <span style={{ fontSize: "24px" }}>Search by team's name:</span>
          <input
            type="text"
            placeholder="Type team's name..."
            value={searchTeam}
            onChange={(e) => setSearchTeam(e.target.value)}
          />
        </div>

        {selectedTeams.length > 0 && (
          <div className="filter-field">
            <span style={{ fontSize: "24px" }}>
              Select {2 - selectedTeams.length} more team
              {selectedTeams.length === 1 ? "" : "s"}
            </span>
            <button onClick={() => setSelectedTeams([])}>
              Clear Selection
            </button>
          </div>
        )}
        {selectedTeams.length === 2 && (
          <div className="filter-field">
            <span style={{ fontSize: "24px" }}>
              {selectedTeams[0].name} vs {selectedTeams[1].name}
            </span>
            <button onClick={compareTeams}>Compare</button>
          </div>
        )}
      </div>

      {filteredData.map((team) => {
        // Get the scores data for the team from the teamScores object
        const scores = teamScores[team.name] || [];

        // Create chartData based on the teamScores data
        const chartData = scores.map((entry, index) => ({
          game: `G${index + 1}`,
          score: entry.score,
          score1: entry.score1,
          result: entry.result,
          result1: entry.result1,
        }));

        //const logo = teamLogos[team.name] || Zalgiris;

        return (
          <div key={team.id} className="teamcard">
            <label className="container-checkbox">
              <input
                type="checkbox"
                checked={selectedTeams.some((t) => t.id === team.id)}
                onChange={(e) => toggleTeamSelection(team, e)}
                onClick={(e) => e.stopPropagation()}
              ></input>
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path
                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  pathLength="575.0541381835938"
                  class="path"
                ></path>
              </svg>
            </label>
            <div
              className="teamname"
              onClick={() => handleTeamRedirect(team.name)}
            >
              <img
                src={`http://localhost:5000${team.logo}`}
                alt={`${team} logo`}
                className="team-logo"
              />
              {team.name}
            </div>
            <Graphs
              title="Past game scores"
              chartData={chartData}
              dataKey="score"
              useResultColor={true}
              secondDataKey="score1"
            />
          </div>
        );
      })}
      <BetOverlay />
    </div>
  );
};

export default AllTeams;
