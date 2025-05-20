import rankPlayersByEfficiency from "./RankPlayersByEfficiency";

const getTopPlayers = (players, count = 2) => {
  const rankedPlayers = rankPlayersByEfficiency(players);
  return rankedPlayers.slice(0, count);
};

export default getTopPlayers;
