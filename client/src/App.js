import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AllTeams } from "./Components/AllTeams/AllTeams";
import { Login } from "./Components/Login/Login";
import { MainPage } from "./Components/MainPage/MainPage";
import { NavBar } from "./Components/NavBar/NavBar";
import { Ratings } from "./Components/Ratings/Ratings";
import { Register } from "./Components/Register/Register";
import { Schedule } from "./Components/Schedule/Schedule";
import { Settings } from "./Components/Settings/Settings";
import { TeamPlayers } from "./Components/TeamPlayers/TeamPlayers";
import { TeamStats } from "./Components/TeamStats/TeamStats";
import CompareTeams from "./Components/CompareTeams/CompareTeams";
import { MatchDetails } from "./Components/Schedule/MatchDetails";

import "./App.css";

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

function Layout() {
  const location = useLocation();
  const publicRoutes = ["/Login", "/Register"];
  const hideNavBar = publicRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/AllTeams" element={<AllTeams />} />
        <Route path="/Ratings" element={<Ratings />} />
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/TeamPlayers/:PlayersId" element={<TeamPlayers />} />
        <Route path="/TeamStats/:teamName" element={<TeamStats />} />
        <Route path="/MatchDetails/:matchId" element={<MatchDetails />} />
        <Route
          path="/CompareTeams/:team1Name/:team2Name"
          element={<CompareTeams />}
        />
      </Routes>
    </>
  );
}

export default App;
