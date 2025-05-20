import { useState, useEffect } from "react";

const BACKEND_URL = "http://localhost:5000";

const useFetchEuroleagueData = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [resMatches, resTeams, resPlayers] = await Promise.all([
          fetch(`${BACKEND_URL}/api/euroleaguematches`),
          fetch(`${BACKEND_URL}/api/teams`),
          fetch(`${BACKEND_URL}/api/players`),
        ]);

        if (!resMatches.ok || !resTeams.ok || !resPlayers.ok) {
          throw new Error("Failed to fetch some data.");
        }

        const [matchesData, teamsData, playersData] = await Promise.all([
          resMatches.json(),
          resTeams.json(),
          resPlayers.json(),
        ]);

        setMatches(matchesData);
        setTeams(teamsData);
        setPlayers(playersData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { matches, players, teams, loading, error };
};

export default useFetchEuroleagueData;
