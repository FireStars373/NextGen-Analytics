import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MatchDetails.css";

export const MatchDetails = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);

        // Fetch match data
        const matchResponse = await fetch(
          `${BACKEND_URL}/api/euroleaguematches/${matchId}`
        );
        if (!matchResponse.ok) {
          throw new Error("Failed to fetch match data");
        }
        const match = await matchResponse.json();
        setMatchData(match);

        // Fetch player stats
        const statsResponse = await fetch(
          `${BACKEND_URL}/api/euroleaguematches/${matchId}/player-stats`
        );
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch player stats");
        }
        const stats = await statsResponse.json();
        setPlayerStats(stats);

        // Fetch teams data
        const teamsResponse = await fetch(`${BACKEND_URL}/api/teams`);
        if (!teamsResponse.ok) {
          throw new Error("Failed to fetch teams data");
        }
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      } catch (err) {
        console.error("Error fetching match data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatchData();
    }
  }, [matchId, BACKEND_URL]);

  if (loading) return <div className="loading">Loading match details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!matchData) return <div className="error">Match not found</div>;

  const homeTeam = teams.find((t) => t.id === matchData.home_team_id);
  const awayTeam = teams.find((t) => t.id === matchData.away_team_id);

  // Get player stats for each team
  const homePlayerStats = playerStats.filter(
    (p) => p.team_id === matchData.home_team_id
  );
  const awayPlayerStats = playerStats.filter(
    (p) => p.team_id === matchData.away_team_id
  );

  // Sort players by points scored
  const sortByPoints = (a, b) => (b.points || 0) - (a.points || 0);
  const sortedHomeStats = [...homePlayerStats].sort(sortByPoints);
  const sortedAwayStats = [...awayPlayerStats].sort(sortByPoints);

  // Get top performers (players with highest points)
  const topPerformers = [...playerStats].sort(sortByPoints).slice(0, 5);

  return (
    <div className="match-details-container">
      {/* Match Header */}
      <div className="match-header">
        <div className="team-section">
          <img src={`${BACKEND_URL}${homeTeam?.logo}`} alt={homeTeam?.name} />
          <h2>{homeTeam?.name}</h2>
        </div>
        <div className="score-section">
          <h1>
            {matchData.home_score} - {matchData.away_score}
          </h1>
          <p>{new Date(matchData.match_date).toLocaleDateString()}</p>
        </div>
        <div className="team-section">
          <img src={`${BACKEND_URL}${awayTeam?.logo}`} alt={awayTeam?.name} />
          <h2>{awayTeam?.name}</h2>
        </div>
      </div>

      {/* Top Performers */}
      <div className="top-performers-section">
        <h3>Best Players</h3>
        <div className="top-performers">
          {topPerformers.map((player) => (
            <div key={player.id} className="player-card">
              <div className="player-header">
                <h4>{player.player_name}</h4>
                <p>{player.team_name}</p>
              </div>
              <div className="player-stats">
                <div className="stat">
                  <span>MIN</span>
                  <span>{player.minutes_played}</span>
                </div>
                <div className="stat">
                  <span>PTS</span>
                  <span>{player.points}</span>
                </div>
                <div className="stat">
                  <span>REB</span>
                  <span>{player.rebounds}</span>
                </div>
                <div className="stat">
                  <span>AST</span>
                  <span>{player.assists}</span>
                </div>
                <div className="stat">
                  <span>+/-</span>
                  <span
                    className={player.plus_minus >= 0 ? "positive" : "negative"}
                  >
                    {player.plus_minus > 0 ? "+" : ""}
                    {player.plus_minus}
                  </span>
                </div>
              </div>
              <div className="player-shooting">
                <div>
                  <span>2PT</span>
                  <span>
                    {player.fg2_made}/{player.fg2_attempts}
                  </span>
                </div>
                <div>
                  <span>3PT</span>
                  <span>
                    {player.fg3_made}/{player.fg3_attempts}
                  </span>
                </div>
                <div>
                  <span>FT</span>
                  <span>
                    {player.ft_made}/{player.ft_attempts}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Statistics */}
      <div className="team-stats">
        <h3>Team Statistics</h3>
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>{homeTeam?.name}</th>
                <th>Statistic</th>
                <th>{awayTeam?.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{matchData.home_score}</td>
                <td>Points</td>
                <td>{matchData.away_score}</td>
              </tr>
              <tr>
                <td>
                  {homePlayerStats.reduce(
                    (sum, p) => sum + (p.rebounds || 0),
                    0
                  )}
                </td>
                <td>Rebounds</td>
                <td>
                  {awayPlayerStats.reduce(
                    (sum, p) => sum + (p.rebounds || 0),
                    0
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  {homePlayerStats.reduce(
                    (sum, p) => sum + (p.assists || 0),
                    0
                  )}
                </td>
                <td>Assists</td>
                <td>
                  {awayPlayerStats.reduce(
                    (sum, p) => sum + (p.assists || 0),
                    0
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  {homePlayerStats.reduce((sum, p) => sum + (p.steals || 0), 0)}
                </td>
                <td>Steals</td>
                <td>
                  {awayPlayerStats.reduce((sum, p) => sum + (p.steals || 0), 0)}
                </td>
              </tr>
              <tr>
                <td>
                  {homePlayerStats.reduce((sum, p) => sum + (p.blocks || 0), 0)}
                </td>
                <td>Blocks</td>
                <td>
                  {awayPlayerStats.reduce((sum, p) => sum + (p.blocks || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* All Players Statistics */}
      <div className="all-players-stats">
        <h3>All Players Statistics</h3>

        {/* Home Team */}
        <div className="team-stats">
          <h4>{homeTeam?.name}</h4>
          <div className="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>MIN</th>
                  <th>PTS</th>
                  <th>REB</th>
                  <th>AST</th>
                  <th>STL</th>
                  <th>BLK</th>
                  <th>+/-</th>
                  <th>2PT</th>
                  <th>3PT</th>
                  <th>FT</th>
                </tr>
              </thead>
              <tbody>
                {sortedHomeStats.map((player) => (
                  <tr key={player.id}>
                    <td>{player.player_name}</td>
                    <td>{player.minutes_played}</td>
                    <td>{player.points}</td>
                    <td>{player.rebounds}</td>
                    <td>{player.assists}</td>
                    <td>{player.steals}</td>
                    <td>{player.blocks}</td>
                    <td
                      className={
                        player.plus_minus >= 0 ? "positive" : "negative"
                      }
                    >
                      {player.plus_minus > 0 ? "+" : ""}
                      {player.plus_minus}
                    </td>
                    <td>
                      {player.fg2_made}/{player.fg2_attempts}
                    </td>
                    <td>
                      {player.fg3_made}/{player.fg3_attempts}
                    </td>
                    <td>
                      {player.ft_made}/{player.ft_attempts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Away Team */}
        <div className="team-stats">
          <h4>{awayTeam?.name}</h4>
          <div className="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>MIN</th>
                  <th>PTS</th>
                  <th>REB</th>
                  <th>AST</th>
                  <th>STL</th>
                  <th>BLK</th>
                  <th>+/-</th>
                  <th>2PT</th>
                  <th>3PT</th>
                  <th>FT</th>
                </tr>
              </thead>
              <tbody>
                {sortedAwayStats.map((player) => (
                  <tr key={player.id}>
                    <td>{player.player_name}</td>
                    <td>{player.minutes_played}</td>
                    <td>{player.points}</td>
                    <td>{player.rebounds}</td>
                    <td>{player.assists}</td>
                    <td>{player.steals}</td>
                    <td>{player.blocks}</td>
                    <td
                      className={
                        player.plus_minus >= 0 ? "positive" : "negative"
                      }
                    >
                      {player.plus_minus > 0 ? "+" : ""}
                      {player.plus_minus}
                    </td>
                    <td>
                      {player.fg2_made}/{player.fg2_attempts}
                    </td>
                    <td>
                      {player.fg3_made}/{player.fg3_attempts}
                    </td>
                    <td>
                      {player.ft_made}/{player.ft_attempts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
