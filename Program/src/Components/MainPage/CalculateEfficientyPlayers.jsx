const calculateEfficiencyRating = (player) => {
  const stats = player;
  if (!stats || !stats.minutes) return 0;

  const points = stats.points * 2;
  const rebounds = stats.rebounds;
  const assists = stats.assists * 1.5;
  const steals = stats.steals || 0;
  const blocks = stats.blocks || 0;

  const missedShots =
    (stats.fieldGoals?.fg2Attempts || 0) -
    (stats.fieldGoals?.fg2Made || 0) +
    (stats.fieldGoals?.fg3Attempts || 0) -
    (stats.fieldGoals?.fg3Made || 0);

  const missedFreeThrows =
    (stats.fieldGoals?.ftAttempts || 0) - (stats.fieldGoals?.ftMade || 0);

  const turnovers = stats.turnovers || 0;

  const err = (
    (points +
      rebounds +
      assists +
      steals +
      blocks -
      missedShots -
      turnovers -
      missedFreeThrows) /
    stats.minutes
  ).toFixed(2);

  return parseFloat(err);
};

export default calculateEfficiencyRating;
