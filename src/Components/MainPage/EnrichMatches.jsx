const enrichMatches = (matches, teams, players) => {
  return matches.map((match) => {
    const homeTeam = teams.find((team) => team.id === match.home_team_id);
    const awayTeam = teams.find((team) => team.id === match.away_team_id);

    const homePlayers = players.filter(
      (player) => player.team === homeTeam?.name
    );
    const awayPlayers = players.filter(
      (player) => player.team === awayTeam?.name
    );

    return {
      ...match,
      homeTeam,
      awayTeam,
      homePlayers,
      awayPlayers,
    };
  });
};

export default enrichMatches;
