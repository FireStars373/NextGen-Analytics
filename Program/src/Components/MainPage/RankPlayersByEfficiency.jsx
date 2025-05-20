import calculateEfficiencyRating from "./CalculateEfficientyPlayers";

const rankPlayersByEfficiency = (players) => {
  const playersWithERR = players.map((player) => ({
    ...player,
    efficiencyRating: calculateEfficiencyRating(player),
  }));

  const rankedPlayers = [...playersWithERR]
    .sort((a, b) => b.efficiencyRating - a.efficiencyRating)
    .map((player, index) => ({
      ...player,
      rankByERR: index + 1,
    }));

  return rankedPlayers;
};

export default rankPlayersByEfficiency;
