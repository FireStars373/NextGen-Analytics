import React, { useState, useEffect } from "react";
import "./Schedule.css";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronsRight, ChevronsLeft, Percent } from "lucide-react";
import useFetchEuroleagueData from "../UseFetch/MatchData";
import enrichMatches from "../MainPage/EnrichMatches";
import BetOverlay from "../BetOverlay/BetOverlay";

export const Schedule = () => {
  //States for filtering
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { matches, players, teams, loading, error } = useFetchEuroleagueData();

  const navigate = useNavigate();

  const [searchByMatchName, setSearchByMatchPlayerName] = useState(false); // default: search by match
  const [searchByTeamName, setSearchByTeamName] = useState(false); // default: off
  const [hideUpcomingGames, setHideUpcomingGames] = useState(false);

  const today = new Date();

  const enrichedMatches = enrichMatches(matches, teams, players);

  // Filter past games (i.e., ResultTime < today)
  const pastGames = enrichedMatches.filter(
    (game) => new Date(game.match_date) < today
  );

  // Sort by most recent first
  const sortedPastGames = pastGames.sort(
    (a, b) => new Date(b.match_date) - new Date(a.match_date)
  );

  // Take the latest completed game
  const latestGame = sortedPastGames[0];

  const filteredData = enrichedMatches.filter((match) => {
    const hasSearchText = searchText.trim() !== "";
    const search = searchText.trim().toLowerCase();

    let matchesSearch = true; // default: everything matches if no input

    if (hasSearchText) {
      // Check if homeTeam and awayTeam are defined before attempting to access their names
      const teamMatch =
        (match.homeTeam?.name &&
          match.homeTeam.name.toLowerCase().includes(search)) ||
        (match.awayTeam?.name &&
          match.awayTeam.name.toLowerCase().includes(search));

      // Check if homePlayers and awayPlayers are defined before attempting to access their names
      const matchName =
        match.homePlayers?.some((player) =>
          player.name.toLowerCase().includes(search)
        ) ||
        match.awayPlayers?.some((player) =>
          player.name.toLowerCase().includes(search)
        );
      matchesSearch =
        (searchByTeamName && teamMatch) || (searchByMatchName && matchName);
    }

    const matchDate = new Date(match.match_date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesDate =
      (!from || matchDate >= from) && (!to || matchDate <= to);

    const now = new Date();
    const isPastGame = matchDate < now; // game already played
    const matchesUpcomingFilter = !hideUpcomingGames || isPastGame;

    return matchesSearch && matchesDate && matchesUpcomingFilter;
  });

  const handleMatchOverview = (matchId) => {
    navigate(`/MatchDetails/${matchId}`);
  };
  const handlePlayerOverview = (player) => {
    navigate(`/TeamPlayers/${player}`);
  };
  const handleTeamOverview = (team) => {
    navigate(`/TeamStats/${team}`);
  };

  const formattedDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Adds leading zero if needed
    const day = d.getDate().toString().padStart(2, "0"); // Adds leading zero if needed
    return `${year}/${month}/${day}`;
  };

  const tempMVP = players[0];
  // Safeguard check for latestGame and homeTeam/awayTeam
  if (!latestGame || !latestGame.homeTeam || !latestGame.awayTeam) {
    return;
  }

  // Calculate win probability based on team efficiency ratings
  const calculateWinProbability = (homeTeam, awayTeam) => {
    if (!homeTeam || !awayTeam) return { homeProb: 50, awayProb: 50 };

    // Calculate team efficiency (EFF)
    const calculateTeamEff = (team) => {
      if (!team) return 0;

      // EFF = (PTS + REB + AST + STL + BLK) - (PTS_ALLOWED)
      const positiveStats =
        parseFloat(team.points_per_game || 0) +
        parseFloat(team.rebounds || 0) +
        parseFloat(team.assists || 0) +
        parseFloat(team.steals || 0) +
        parseFloat(team.blocks || 0);

      const negativeStats = parseFloat(team.points_allowed || 0);

      return positiveStats - negativeStats;
    };

    const homeEff = calculateTeamEff(homeTeam);
    const awayEff = calculateTeamEff(awayTeam);

    // Add home court advantage (3 efficiency points)
    const homeEffWithAdvantage = homeEff + 3;

    // Calculate total efficiency
    const totalEff = Math.abs(homeEffWithAdvantage) + Math.abs(awayEff);

    if (totalEff === 0) return { homeProb: 50, awayProb: 50 };

    // Calculate probabilities
    let homeProb = Math.round((homeEffWithAdvantage / totalEff) * 100);
    let awayProb = Math.round((awayEff / totalEff) * 100);

    // Ensure probabilities are between 0 and 100 and sum to 100
    homeProb = Math.min(Math.max(homeProb, 0), 100);
    awayProb = 100 - homeProb;

    return {
      homeProb,
      awayProb,
    };
  };

  // Update the generateWinArguments function to focus on efficiency
  const generateWinArguments = (homeTeam, awayTeam) => {
    if (!homeTeam || !awayTeam) return { home: [], away: [] };

    const homeArgs = [];
    const awayArgs = [];

    // Calculate efficiency ratings
    const calculateEff = (team) => {
      return (
        parseFloat(team.points_per_game || 0) +
        parseFloat(team.rebounds || 0) +
        parseFloat(team.assists || 0) +
        parseFloat(team.steals || 0) +
        parseFloat(team.blocks || 0) -
        parseFloat(team.points_allowed || 0)
      );
    };

    const homeEff = calculateEff(homeTeam);
    const awayEff = calculateEff(awayTeam);

    // Compare scoring
    if (
      parseFloat(homeTeam.points_per_game) >
      parseFloat(awayTeam.points_per_game)
    ) {
      homeArgs.push(`Higher scoring team (${homeTeam.points_per_game} PPG)`);
    } else {
      awayArgs.push(`Higher scoring team (${awayTeam.points_per_game} PPG)`);
    }

    // Compare defense
    if (
      parseFloat(homeTeam.points_allowed) < parseFloat(awayTeam.points_allowed)
    ) {
      homeArgs.push(
        `Better defensive team (${homeTeam.points_allowed} points allowed)`
      );
    } else {
      awayArgs.push(
        `Better defensive team (${awayTeam.points_allowed} points allowed)`
      );
    }

    // Compare overall efficiency
    if (homeEff > awayEff) {
      homeArgs.push(`Higher efficiency rating (${homeEff.toFixed(1)} EFF)`);
    } else {
      awayArgs.push(`Higher efficiency rating (${awayEff.toFixed(1)} EFF)`);
    }

    // Add home court advantage
    homeArgs.push("Home court advantage (+3 EFF bonus)");

    return {
      home: homeArgs,
      away: awayArgs,
    };
  };

  return (
    <div>
      <h1 className="page-h1">Match history</h1>
      <div className="filter-field-container">
        <div className="filter-field">
          <p>Search Matches</p>
          <input
            type="text"
            placeholder="Type team's name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <label class="container-checkbox">
            <input
              type="checkbox"
              checked={searchByMatchName}
              onChange={() => setSearchByMatchPlayerName(!searchByMatchName)}
            ></input>
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938"
                class="path"
              ></path>
            </svg>
            <text>Search by Player Name</text>
          </label>

          <label class="container-checkbox">
            <input
              type="checkbox"
              checked={searchByTeamName}
              onChange={() => setSearchByTeamName(!searchByTeamName)}
            ></input>
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938"
                class="path"
              ></path>
            </svg>
            <text>Search by Team Name</text>
          </label>

          <label class="container-checkbox">
            <input
              type="checkbox"
              checked={hideUpcomingGames}
              onChange={() => setHideUpcomingGames(!hideUpcomingGames)}
            ></input>
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938"
                class="path"
              ></path>
            </svg>
            <text>Hide Upcoming Games</text>
          </label>
        </div>
        <div className="filter-field-overview">
          <span>Check out latest match overview</span>
          <div className="filter-field-match-info">
            <p>
              <img
                style={{ width: "100px" }}
                src={`http://localhost:5000${latestGame.homeTeam.logo}`}
                alt="Description"
                onClick={() => handleTeamOverview(latestGame.homeTeam.name)}
              />
            </p>
            <p onClick={() => handleTeamOverview(latestGame.homeTeam.name)}>
              {latestGame.homeTeam.name}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              {parseInt(latestGame.home_score) >
                parseInt(latestGame.away_score) && (
                <ChevronsLeft
                  style={{
                    width: "48px",
                    height: "48px",
                    color: "#4CAF50",
                    marginRight: "15px",
                  }}
                />
              )}
              <p
                style={{
                  margin: "0 15px",
                  fontWeight: "bold",
                  fontSize: "36px",
                }}
              >
                {latestGame.home_score}
              </p>
              <p style={{ margin: "0 15px", fontSize: "36px" }}>X</p>
              <p
                style={{
                  margin: "0 15px",
                  fontWeight: "bold",
                  fontSize: "36px",
                }}
              >
                {latestGame.away_score}
              </p>
              {parseInt(latestGame.home_score) <
                parseInt(latestGame.away_score) && (
                <ChevronsRight
                  style={{
                    width: "48px",
                    height: "48px",
                    color: "#4CAF50",
                    marginLeft: "15px",
                  }}
                />
              )}
            </div>
            <p onClick={() => handleTeamOverview(latestGame.awayTeam.name)}>
              {latestGame.awayTeam.name}
            </p>
            <p>
              <img
                style={{ width: "100px" }}
                src={`http://localhost:5000${latestGame.awayTeam.logo}`}
                alt="Description"
                onClick={() => handleTeamOverview(latestGame.awayTeam.name)}
              />
            </p>
          </div>
          <div className="game-details-overview-group">
            <text
              style={{ fontSize: "28px" }}
              onClick={() => handleMatchOverview(latestGame.id)}
            >
              More Information
            </text>
            <ArrowRight
              style={{
                width: "32px",
                height: "32px",
              }}
              onClick={() => handleMatchOverview(latestGame.id)}
            ></ArrowRight>
          </div>
        </div>
      </div>

      <table>
        <tbody>
          {filteredData.map((match, index) => (
            <React.Fragment key={match.id}>
              <tr
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                style={{ cursor: "pointer" }}
              >
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <img
                      style={{ width: "20px" }}
                      src={`http://localhost:5000${match.homeTeam?.logo}`}
                      alt="Description"
                      onClick={() => handleTeamOverview(match.homeTeam?.name)}
                    />
                    <a href={`/TeamStats/${match.homeTeam?.name}`}>
                      {match.homeTeam?.name}
                    </a>
                  </p>
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {new Date(match.match_date) > today ? (
                    <div className="match-prediction">
                      {(() => {
                        const prob = calculateWinProbability(
                          match.homeTeam,
                          match.awayTeam
                        );
                        return (
                          <div className="probability-display">
                            <span
                              className={
                                prob.homeProb > prob.awayProb ? "winning" : ""
                              }
                            >
                              {prob.homeProb}%
                            </span>
                            <span style={{ margin: "0 10px", color: "#666" }}>
                              -
                            </span>
                            <span
                              className={
                                prob.awayProb > prob.homeProb ? "winning" : ""
                              }
                            >
                              {prob.awayProb}%
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <strong>
                      {match.home_score} - {match.away_score}
                    </strong>
                  )}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <img
                      style={{ width: "30px" }}
                      src={`http://localhost:5000${match.awayTeam?.logo}`}
                      alt="Description"
                      onClick={() => handleTeamOverview(match.awayTeam?.name)}
                    />
                    <a href={`/TeamStats/${match.awayTeam?.name}`}>
                      {match.awayTeam?.name}
                    </a>
                  </p>
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  Match Date: <strong>{formattedDate(match.match_date)}</strong>
                </td>
              </tr>
              {expandedIndex === index && (
                <tr style={{ backgroundColor: "transparent" }}>
                  <td colSpan="4">
                    <div className="game-details">
                      {new Date(match.match_date) > today ? (
                        // Future match view
                        <div className="game-prediction-details">
                          <h3 style={{ fontSize: "32px" }}>
                            Match Predictions
                          </h3>
                          <div className="prediction-arguments">
                            <div className="team-arguments">
                              <center>
                                <h4
                                  style={{
                                    fontSize: "26px",
                                    borderBottom: "3px solid #00b7ff",
                                  }}
                                >
                                  {match.homeTeam?.name} Advantages
                                </h4>
                                {(() => {
                                  const args = generateWinArguments(
                                    match.homeTeam,
                                    match.awayTeam
                                  );
                                  return (
                                    <ul>
                                      {args.home.map((arg, i) => (
                                        <li
                                          style={{
                                            fontSize: "20px",
                                            opacity: "0.5",
                                          }}
                                          key={i}
                                        >
                                          {arg}
                                        </li>
                                      ))}
                                    </ul>
                                  );
                                })()}
                              </center>
                            </div>
                            <div className="team-arguments">
                              <center>
                                <h4
                                  style={{
                                    fontSize: "26px",
                                    borderBottom: "3px solid #00b7ff",
                                  }}
                                >
                                  {match.awayTeam?.name} Advantages
                                </h4>
                                {(() => {
                                  const args = generateWinArguments(
                                    match.homeTeam,
                                    match.awayTeam
                                  );
                                  return (
                                    <ul>
                                      {args.away.map((arg, i) => (
                                        <li
                                          style={{
                                            fontSize: "20px",
                                            opacity: "0.5",
                                          }}
                                          key={i}
                                        >
                                          {arg}
                                        </li>
                                      ))}
                                    </ul>
                                  );
                                })()}
                              </center>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Past match view (existing code)
                        <>
                          <div className="game-details-roster">
                            <p>Team Rosters</p>
                            <div className="game-details-teams">
                              <span
                                onClick={() =>
                                  handleTeamOverview(match.homeTeam?.name)
                                }
                              >
                                {match.homeTeam?.name}
                              </span>
                              {match.homePlayers.map((p) => (
                                <text
                                  onClick={() => handlePlayerOverview(p.id)}
                                  key={p.id}
                                  style={{ fontSize: "18px", padding: "5px" }}
                                >
                                  {p.name}
                                </text>
                              ))}
                            </div>

                            <div className="game-details-teams">
                              <span
                                onClick={() =>
                                  handleTeamOverview(match.awayTeam?.name)
                                }
                              >
                                {match.awayTeam?.name}
                              </span>
                              {match.awayPlayers.map((p) => (
                                <text
                                  onClick={() => handlePlayerOverview(p.id)}
                                  key={p.id}
                                  style={{ fontSize: "18px", padding: "5px" }}
                                >
                                  {p.name}
                                </text>
                              ))}
                            </div>
                          </div>

                          <div className="game-details-overview">
                            <p>
                              The match ended at:{" "}
                              <strong>{formattedDate(match.match_date)}</strong>
                            </p>
                            <p>
                              Match ending score:{" "}
                              <strong>
                                {match.home_score} - {match.away_score}
                              </strong>
                            </p>
                            <p>Most valuable player in the match:</p>
                            <div
                              className="mvp-card"
                              onClick={() => handlePlayerOverview(tempMVP.id)}
                            >
                              <div className="mvp-name">
                                <div className="mvp-stats">
                                  <h2 style={{ margin: "0 0 20px 0" }}>
                                    {tempMVP.name}
                                  </h2>
                                  <li
                                    style={{
                                      fontSize: "26px",
                                      marginBottom: "15px",
                                      opacity: "0.5",
                                    }}
                                  >
                                    Game Scores:
                                  </li>
                                  <li>Position: {tempMVP.position}</li>
                                  <li>Number: {tempMVP.number}</li>
                                  <li>PTS: {tempMVP.points}</li>
                                  <li>REB: {tempMVP.rebounds}</li>
                                  <li>AST: {tempMVP.assists}</li>
                                  <li>
                                    Fouls:{" "}
                                    {tempMVP.fouls_received
                                      ? tempMVP.fouls_committed
                                      : 0}
                                  </li>
                                </div>
                                <img
                                  style={{
                                    alignItems: "center",
                                    justifyContent: "right",
                                    width: "40%",
                                  }}
                                  src={`http://localhost:5000${tempMVP.photo}`}
                                  alt="Player photo"
                                />
                              </div>
                            </div>
                            <div className="game-details-overview-group">
                              <string
                                onClick={() => handleMatchOverview(match.id)}
                              >
                                More Information
                              </string>
                              <ArrowRight
                                style={{
                                  width: "32px",
                                  height: "32px",
                                }}
                                onClick={() => handleMatchOverview(match.id)}
                              ></ArrowRight>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <BetOverlay />
    </div>
  );
};

export default Schedule;
