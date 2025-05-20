import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import { X } from "lucide-react";
import BetOverlay from "../BetOverlay/BetOverlay";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [credits, setCredits] = useState(0);
  const [creditPurchaseSuccess, setCreditPurchaseSuccess] = useState("");
  const [creditPurchaseError, setCreditPurchaseError] = useState("");
  const [subscriptionSuccess, setSubscriptionSuccess] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");

  const [teams, setTeams] = useState(["Real Madrid", "Žalgiris"]);
  const [players, setPlayers] = useState(["Walter Tavales", "Nicola Mirotic"]);

  const [removingTeams, setRemovingTeams] = useState([]);
  const [removingPlayers, setRemovingPlayers] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setCredits(parsedUser.Credit_count || 0);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least 1 uppercase letter and special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={};':"|,.<>?])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePassword(passwordData.newPassword)) {
      setError(
        "Password must be at least 8 characters long, contain at least 1 uppercase letter and 1 special character"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      handleCloseForm();
    } catch (err) {
      setError(err.message);
    }
  };
  const handleCloseForm = () => {
    // Wait for animation to complete before hiding form
    setTimeout(() => {
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 300); // Same duration as the CSS animation
  };

  const handleBuyCredits = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/purchase-credits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            creditAmount: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to purchase credits");
      }

      // Update local state and localStorage
      const updatedUser = { ...user, Credit_count: credits + 1 };
      setUser(updatedUser);
      setCredits(credits + 1);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setCreditPurchaseSuccess("Credit purchased successfully!");
      setTimeout(() => setCreditPurchaseSuccess(""), 3000);
    } catch (err) {
      setCreditPurchaseError(err.message);
      setTimeout(() => setCreditPurchaseError(""), 3000);
    }
  };

  const handleBuySubscription = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/purchase-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            months: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to purchase subscription");
      }

      // Update local state and localStorage
      const updatedUser = {
        ...user,
        premium_status: 1,
        subscription_end_date: data.subscription_end_date,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSubscriptionSuccess("Premium subscription activated successfully!");
      setTimeout(() => setSubscriptionSuccess(""), 3000);
    } catch (err) {
      setSubscriptionError(err.message);
      setTimeout(() => setSubscriptionError(""), 3000);
    }
  };

  if (!user) return null;

  //Temporary thing
  const handleReload = () => {
    navigate("../MainPage");
  };
  const handleTeamRedirect = (team) => {
    navigate(`/TeamStats/${team}`);
  };
  const handlePlayerRedirect = () => {
    navigate("../TeamPlayers");
  };
  const handleDeleteTeam = (teamToDelete) => {
    setRemovingTeams((prev) => [...prev, teamToDelete]);
    setTimeout(() => {
      setTeams((prev) => prev.filter((team) => team !== teamToDelete));
      setRemovingTeams((prev) => prev.filter((team) => team !== teamToDelete));
    }, 500);
  };
  const handleDeletePlayer = (playerToDelete) => {
    setRemovingPlayers((prev) => [...prev, playerToDelete]);
    setTimeout(() => {
      setPlayers((prev) => prev.filter((player) => player !== playerToDelete));
      setRemovingPlayers((prev) =>
        prev.filter((player) => player !== playerToDelete)
      );
    }, 500);
  };
  const clearAllTeams = () => {
    setTeams([]);
  };
  const clearAllPlayers = () => {
    setPlayers([]);
  };
  console.log(user);

  return (
    <div>
      <h1 className="page-h1">Settings</h1>
      <div className="settings-container">
        <div className="settings-layout">
          <div className="settings-sidebar">
            <button
              className={`settings-tab ${
                activeTab === "account" ? "active" : ""
              }`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
            <button
              className={`settings-tab ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
            <button
              className={`settings-tab ${
                activeTab === "following" ? "active" : ""
              }`}
              onClick={() => setActiveTab("following")}
            >
              Followings
            </button>
            <button
              className={`settings-tab ${
                activeTab === "subscriptions" ? "active" : ""
              }`}
              onClick={() => setActiveTab("subscriptions")}
            >
              Subscriptions
            </button>
            <button
              className={`settings-tab ${
                activeTab === "contacts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("contacts")}
            >
              Contacts
            </button>
            <button
              className={`settings-tab ${
                activeTab === "deleteAcc" ? "active" : ""
              }`}
              onClick={() => setActiveTab("deleteAcc")}
            >
              Delete Account
            </button>
          </div>
          <div className="settings-content">
            {activeTab === "account" && (
              <div className="card">
                <h2 className="card-title">Account Info</h2>
                <div className="info-item">
                  <label>Username:</label>
                  <span>{user.username}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone number:</label>
                  <span>{user.number}</span>
                </div>
                <div className="info-item">
                  <label>Date of Birth:</label>
                  <span>{user.dateOfBirth}</span>
                </div>
                <h2 className="card-title">Change Password</h2>
                {!showPasswordForm ? (
                  <button
                    className="submit-button"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Change Password
                  </button>
                ) : (
                  <div>
                    {error && <div className="error-message">{error}</div>}
                    {success && (
                      <div className="success-message">{success}</div>
                    )}
                    <form onSubmit={handleSubmitPassword}>
                      <div className="form-group">
                        <label>Current Password:</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>New Password:</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirm New Password:</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="button-group">
                        <button type="submit" className="submit-button">
                          Change Password
                        </button>
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={handleCloseForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="card">
                <h2 className="card-title">Notification Preferences</h2>
                <div className="input-group">
                  <label class="container-checkbox">
                    <input type="checkbox"></input>
                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                      <path
                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                        pathLength="575.0541381835938"
                        class="path"
                      ></path>
                    </svg>
                    <text>
                      Notify about changes in my following player's stats.
                    </text>
                  </label>
                </div>
                <div className="input-group">
                  <label class="container-checkbox">
                    <input type="checkbox"></input>
                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                      <path
                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                        pathLength="575.0541381835938"
                        class="path"
                      ></path>
                    </svg>
                    <text>
                      Notify about changes in my following team's stats.
                    </text>
                  </label>
                </div>
                <div className="input-group">
                  <label class="container-checkbox">
                    <input type="checkbox"></input>
                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                      <path
                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                        pathLength="575.0541381835938"
                        class="path"
                      ></path>
                    </svg>
                    <text>Notify about upcoming new games.</text>
                  </label>
                </div>
                <div className="input-group">
                  <label class="container-checkbox">
                    <input type="checkbox"></input>
                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                      <path
                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                        pathLength="575.0541381835938"
                        class="path"
                      ></path>
                    </svg>
                    <text>Notify when latest games overview is published.</text>
                  </label>
                </div>
                <button className="submit-button">Save Preferences</button>
              </div>
            )}

            {activeTab === "following" && (
              <div className="card">
                <h2 className="card-title">Teams You're Following</h2>
                <ul>
                  {teams.length > 0 ? (
                    teams.map((team, index) => (
                      <div className="following-items" key={index}>
                        <li
                          className={`following-items-li ${
                            removingTeams.includes(team) ? "removing" : ""
                          }`}
                        >
                          <X
                            className="following-items-x"
                            onClick={() => handleDeleteTeam(team)}
                          />
                          <string onClick={() => handleTeamRedirect(team)}>
                            {team}
                          </string>
                        </li>
                      </div>
                    ))
                  ) : (
                    <li
                      className="following-items"
                      style={{ fontSize: "26px" }}
                    >
                      You are currently not following any teams.
                    </li>
                  )}
                </ul>
                <h2 className="card-title">Players You're Following</h2>
                <ul>
                  {players.length > 0 ? (
                    players.map((player, index) => (
                      <div className="following-items" key={index}>
                        <li
                          className={`following-items-li ${
                            removingPlayers.includes(player) ? "removing" : ""
                          }`}
                        >
                          <X
                            className="following-items-x"
                            onClick={() => handleDeletePlayer(player)}
                          />
                          <string onClick={() => handlePlayerRedirect()}>
                            {player}
                          </string>
                        </li>
                      </div>
                    ))
                  ) : (
                    <li
                      className="following-items"
                      style={{ fontSize: "26px" }}
                    >
                      You are currently not following any players.
                    </li>
                  )}
                </ul>
                <div className="button-group">
                  <button className="clear-button" onClick={clearAllTeams}>
                    Unfollow All Teams
                  </button>
                  <button className="clear-button" onClick={clearAllPlayers}>
                    Unfollow All Players
                  </button>
                </div>
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div className="card">
                <h2 className="card-title">Subscription Plan</h2>
                <p style={{ fontSize: "26px" }}>
                  You are currently on the{" "}
                  <strong>
                    {user.premium_status === 1 ? "Premium" : "Free"}
                  </strong>{" "}
                  plan.
                </p>
                {user.premium_status === 1 && user.subscription_end_date && (
                  <p style={{ fontSize: "20px", color: "#00b7ff" }}>
                    Your premium subscription is active until:{" "}
                    <strong>
                      {
                        new Date(user.subscription_end_date)
                          .toISOString()
                          .split("T")[0]
                      }
                    </strong>
                  </p>
                )}
                <p style={{ fontSize: "26px", marginBottom: "25px" }}>
                  You currently have <strong>{credits}</strong> credits.
                </p>
                {creditPurchaseSuccess && (
                  <div className="success-message">{creditPurchaseSuccess}</div>
                )}
                {creditPurchaseError && (
                  <div className="error-message">{creditPurchaseError}</div>
                )}
                {subscriptionSuccess && (
                  <div className="success-message">{subscriptionSuccess}</div>
                )}
                {subscriptionError && (
                  <div className="error-message">{subscriptionError}</div>
                )}
                <div className="subscription-plan">
                  <h3>
                    Premium Plan <strong>3.99 €</strong>
                  </h3>
                  <ul>
                    <li>Unlimited information about players.</li>
                    <li>Being able to see whole EuroLeagues ratings.</li>
                    <li>Access to top 3 players rankings.</li>
                    <li>1 month of premium access.</li>
                  </ul>
                  <button
                    className="submit-button"
                    onClick={handleBuySubscription}
                    disabled={user.premium_status === 1}
                  >
                    {user.premium_status === 1
                      ? "Already Premium"
                      : "Buy subscription"}
                  </button>
                </div>
                <div className="subscription-plan">
                  <h3>
                    Single Credit <strong>0.99 €</strong>
                  </h3>
                  <ul>
                    <li>
                      Detailed inforgraphic information about one selected
                      player.
                    </li>
                  </ul>
                  <button className="submit-button" onClick={handleBuyCredits}>
                    Buy credits
                  </button>
                </div>
                <div className="subscription-plan"></div>
              </div>
            )}

            {activeTab === "contacts" && (
              <div className="card">
                <h2>Having some problems? Feel free to contact us!</h2>
                <div className="info-item">
                  <label>Your Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    id="contact-message"
                    rows="4"
                    placeholder="Write your message here..."
                    className="textarea"
                  ></textarea>
                </div>
                <button className="submit-button" onClick={handleReload}>
                  Send Message
                </button>
              </div>
            )}

            {activeTab === "deleteAcc" && (
              <div className="card">
                <h2 className="card-title">Delete Account</h2>
                <p style={{ fontSize: "26px" }}>
                  We are very sad to see you leave. Help us improve by leaving a
                  message.
                </p>
                <button
                  className={`submit-button ${
                    activeTab === "contacts" ? "active" : ""
                  }`}
                  style={{ marginBottom: "40px" }}
                  onClick={() => setActiveTab("contacts")}
                >
                  Contacts
                </button>
                <p style={{ fontSize: "24px" }}>
                  All account information data will be deleted and cannot be
                  recovered.
                </p>
                <p style={{ fontSize: "24px" }}>This action is permanent.</p>
                <button
                  className="clear-button"
                  style={{ marginTop: "15px" }}
                  onClick={() => setShowDeleteOverlay(true)}
                >
                  Delete Account
                </button>
              </div>
            )}

            {showDeleteOverlay && (
              <div className="overlay">
                <div className="overlay-content">
                  <h3>Are you sure you want to delete your account?</h3>
                  <p>This action cannot be undone.</p>
                  <div className="button-group">
                    <button
                      className="submit-button"
                      style={{ backgroundColor: "#971818" }}
                      onClick={handleReload}
                    >
                      Yes, Delete
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        setShowDeleteOverlay(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <BetOverlay />
    </div>
  );
};

export default Settings;
