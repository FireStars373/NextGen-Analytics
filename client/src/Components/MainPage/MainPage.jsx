import React, { useState, useEffect } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import background_img from "../Assets/basketball.png";

import BetOverlay from "../BetOverlay/BetOverlay";
import useFetchEuroleagueData from "../UseFetch/MatchData";
import getTopPlayers from "./GetTopPlayers";
import calculateEfficiencyRating from "./CalculateEfficientyPlayers";
import enrichMatches from "./EnrichMatches";

import StarRating from "./StarRating";
import Charts from "../Graphs/Charts";
import {
  ClockFading,
  Tv,
  ChartNoAxesCombined,
  Flame,
  PieChart,
  ArrowRight,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

export const MainPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [selected, setSelected] = useState("Content1");
  const { matches, players, teams, loading, error } = useFetchEuroleagueData();
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:5000";
  const isLoggedIn = !!localStorage.getItem("user"); // or context, cookie, etc.

  const topPlayers = getTopPlayers(players, 2);

  const today = new Date();

  const enrichedMatches = enrichMatches(matches, teams, players);
  const pastGames = enrichedMatches.filter(
    (game) => new Date(game.match_date) < today
  );
  // Filter past games (i.e., ResultTime < today)
  const upcomingGames = enrichedMatches
    .filter((game) => new Date(game.match_date) > today)
    .slice(0, 2);

  const sortedPastGames = pastGames.sort(
    (a, b) => new Date(b.match_date) - new Date(a.match_date)
  );
  const latestGame = sortedPastGames[0];
  console.log(upcomingGames);

  const handleTeamOverview = (team) => {
    navigate(`/TeamStats/${team}`);
  };
  const handleMatchOverview = (matchId) => {
    navigate(`/MatchDetails/${matchId}`);
  };
  const handlePlayerOverview = (player) => {
    navigate(`/TeamPlayers/${player}`);
  };

  const contentOrder = ["Content1", "Content2", "Content3", "Content4"];

  useEffect(() => {
    const interval = setInterval(() => {
      setSelected((prev) => {
        const currentIndex = contentOrder.indexOf(prev);
        const nextIndex = (currentIndex + 1) % contentOrder.length;
        return contentOrder[nextIndex];
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const contentMap = {
    Content1: (
      <div className="top-players-section">
        <center>
          <h2>Top Rated Players</h2>
        </center>
        <div className="top-players">
          {topPlayers.map((player, index) => (
            <div
              key={player.id}
              onClick={() => handlePlayerOverview(player.id)}
              className="top-player-card"
              style={{ backgroundColor: "#2b2b2b" }}
            >
              <div className="top-player-rank">{index + 1}</div>
              <div className="top-player-photo">
                <img
                  style={{ width: "130px" }}
                  src={`http://localhost:5000${player.photo}`}
                  alt={`${player.name} photo`}
                />
              </div>
              <div className="top-player-info">
                <center>
                  <h3 style={{ fontSize: "32px" }}>{player.name}</h3>
                  <p style={{ opacity: "50%" }}>
                    {player.team} | {player.position}
                  </p>
                  <div className="top-player-stats">
                    <div className="stat">
                      <text>MIN</text>
                      <text className="stat-value">{player.minutes || 0}</text>
                    </div>
                    <div className="stat">
                      <text>PTS</text>
                      <text className="stat-value">{player.points}</text>
                    </div>
                    <div className="stat-highlight">
                      <text style={{ fontWeight: "bold" }}>ERR</text>
                      <text className="stat-value">
                        {calculateEfficiencyRating(player)}
                      </text>
                    </div>
                  </div>
                </center>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    Content2: (
      <div>
        <h2>Upcoming Games</h2>
        {upcomingGames && upcomingGames.length > 0 ? (
          upcomingGames.map((game, index) => (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "10px",
                }}
              >
                {/* Home Team Section */}
                <div style={{ textAlign: "center", margin: "0 20px" }}>
                  <img
                    style={{ height: "100px" }}
                    src={`${BACKEND_URL}${game.homeTeam.logo}`}
                    alt={`${game.homeTeam.name} logo`}
                    onClick={() => handleTeamOverview(game.homeTeam.name)}
                  />
                  <p
                    style={{ fontSize: "24px" }}
                    onClick={() => handleTeamOverview(game.homeTeam.name)}
                  >
                    {game.homeTeam.name}
                  </p>
                </div>

                {/* Away Team Section */}
                <div style={{ textAlign: "center", margin: "0 20px" }}>
                  <img
                    style={{ height: "100px" }}
                    src={`${BACKEND_URL}${game.awayTeam.logo}`}
                    alt={`${game.awayTeam.name} logo`}
                    onClick={() => handleTeamOverview(game.awayTeam.name)}
                  />
                  <p
                    style={{ fontSize: "24px" }}
                    onClick={() => handleTeamOverview(game.awayTeam.name)}
                  >
                    {game.awayTeam.name}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "36px",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    color: "grey",
                    marginBottom: "50px",
                  }}
                >
                  {new Date(game.match_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming games available.</p>
        )}
      </div>
    ),
    Content3: (
      <div>
        {latestGame && latestGame.homeTeam && latestGame.awayTeam && (
          <div>
            <h2>Check out latest match overview</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "50px",
              }}
            >
              <div style={{ textAlign: "center", margin: "0 20px" }}>
                <img
                  style={{ height: "180px" }}
                  src={`${BACKEND_URL}${latestGame.homeTeam.logo}`}
                  alt={`${latestGame.homeTeam.name} logo`}
                  onClick={() => handleTeamOverview(latestGame.homeTeam.name)}
                />
                <p
                  style={{ fontSize: "36px" }}
                  onClick={() => handleTeamOverview(latestGame.homeTeam.name)}
                >
                  {latestGame.homeTeam.name}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "36px",
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

              <div style={{ textAlign: "center", margin: "0 20px" }}>
                <img
                  style={{ height: "180px" }}
                  src={`${BACKEND_URL}${latestGame.awayTeam.logo}`}
                  alt={`${latestGame.awayTeam.name} logo`}
                  onClick={() => handleTeamOverview(latestGame.awayTeam.name)}
                />
                <p
                  style={{ fontSize: "36px" }}
                  onClick={() => handleTeamOverview(latestGame.awayTeam.name)}
                >
                  {latestGame.awayTeam.name}
                </p>
              </div>
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
        )}
      </div>
    ),
    Content4: (
      <div>
        <h2>User Polls</h2>
        <p style={{ opacity: "50%", fontSize: "24px" }}>Question of the day:</p>
        <p style={{ margin: "30px", textAlign: "center", fontSize: "22px" }}>
          In the upcoming game (Stanbuvo Anadolu Efes vs Žalgiris) how many
          minutes will Laurynas Birutis be in the field?
        </p>
        <div className="piechart">
          <Charts />
        </div>
      </div>
    ),
  };

  const reviews = [
    {
      name: "HoopsGuru23",
      rating: 4,
      text: "Really solid platform with a ton of great data. Would love to see more historical stats, but overall it's been super helpful.",
    },
    {
      name: "BasketballFanatic91",
      rating: 5,
      text: "The live stats are impressive and mostly accurate. Some pages load a bit slow during high-traffic times, but it's worth the wait.",
    },
    {
      name: "DataDrivenCoach",
      rating: 4,
      text: "Great tool for digging deeper...",
    },
    {
      name: "FantasyKingX",
      rating: 3,
      text: "Tons of potential. Right now it's great, but with a few more features or updates, it could be the go-to spot for basketball data.",
    },
    {
      name: "CourtsideCritic",
      rating: 4,
      text: "I use it almost daily. It's not perfect, but it's better than most and keeps improving. Excited to see where it goes.",
    },
  ];
  const allReviews = [...reviews, ...reviews];

  const sections = [
    <div>
      <div>
        <img className="mainpage-img" src={background_img} alt="" />
      </div>
      <div className="mainpage-h1">Welcome to NextGen Analytics</div>
      <div className="mainpage-text">
        A platform built for those who want more than just box scores — track
        live changing stats, explore game analytics, and discover stories hidden
        in the data.
      </div>
    </div>,

    <div>
      <h1 className="page-h1">What We Offer</h1>
      <div className="offer-grid">
        <button className="offer-card">
          <Flame className="offer-icon" />
          <h3>Interesting facts about players</h3>
          <p>
            Discover hidden stats, career milestones, and every day changing
            quirky facts that make each player unique.
          </p>
        </button>
        <button className="offer-card">
          <ClockFading className="offer-icon" />
          <h3>Real time statistics</h3>
          <p>
            Stay updated with live player performance analysis, team stats, and
            game timelines — all in real time.
          </p>
        </button>
        <button className="offer-card">
          <Tv className="offer-icon" />
          <h3>Game analysis</h3>
          <p>
            Never miss another game with notifications about upcoming games and
            post-game summaries to help you see the game deeper.
          </p>
        </button>
        <button className="offer-card">
          <ChartNoAxesCombined className="offer-icon" />
          <h3>Original rating system</h3>
          <p>Take a look to our custom player rating model.</p>
        </button>
      </div>
      <div className="offer-card-info">
        <h2>Did you know that?</h2>
        <h3>
          Brady Manek - American, whose playing style and appearance have been
          compared to NBA legend Larry Bird.
        </h3>
      </div>
    </div>,

    <div>
      <div className="newsinfo-container">
        <div className="news-switch-section">
          <h2 className="page-h1">Newest information</h2>
          <button
            className={`news-switch-button ${
              selected === "Content1" ? "active" : ""
            }`}
            onClick={() => setSelected("Content1")}
          >
            Top rated Players
          </button>
          <button
            className={`news-switch-button ${
              selected === "Content2" ? "active" : ""
            }`}
            onClick={() => setSelected("Content2")}
          >
            Upcoming games
          </button>
          <button
            className={`news-switch-button ${
              selected === "Content3" ? "active" : ""
            }`}
            onClick={() => setSelected("Content3")}
          >
            Latest game information
          </button>
          <button
            className={`news-switch-button ${
              selected === "Content4" ? "active" : ""
            }`}
            onClick={() => setSelected("Content4")}
          >
            Registered user polls
          </button>
        </div>
        <div className="news-content">{contentMap[selected]}</div>
      </div>
    </div>,
  ];
  if (!isLoggedIn) {
    sections.push(
      <div>
        <h1 className="page-h1">Hear directly from our users</h1>
        <div className="animate-scroll user-experience-container">
          {allReviews.map((review, index) => (
            <div key={index} className="user-review-card">
              <h3>{review.name}</h3>
              <StarRating rating={review.rating} />
              <p>"{review.text}"</p>
            </div>
          ))}
        </div>
        <div className="animate-scroll user-experience-container">
          {allReviews.map((review, index) => (
            <div key={index} className="user-review-card">
              <h3>{review.name}</h3>
              <StarRating rating={review.rating} />
              <p>"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleScroll = (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
    } else {
      setCurrentSection((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="mainpage-container" onWheel={handleScroll}>
      <div>
        {sections.map((content, index) => (
          <section
            key={index}
            className="page"
            style={{ transform: `translateY(-${currentSection * 100}vh)` }}
          >
            {content}
          </section>
        ))}
      </div>
      <BetOverlay />
    </div>
  );
};

export default MainPage;

/*<div>
      <div className="questions-container">
        <div className="item1">
          <text>Most asked questions.</text>
        </div>
        <div className="item2">
          <text>Most asked questions.</text>
        </div>
        <div className="item3">
          <text>Most asked questions.</text>
        </div>
        <div className="item4">
          <text>Most asked questions.</text>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} KVS. All rights reserved.
        </div>
      </div>
    </div>,*/
