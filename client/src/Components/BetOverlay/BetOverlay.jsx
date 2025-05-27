import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BetOverlay.css";
import { Star, ArrowRight, X } from "lucide-react";

const BetOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isLoggedIn = !!localStorage.getItem("user"); // or context, cookie, etc.

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/Login");
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="popup-button">
        <Star className="popup-icon" />
      </button>
      {isOpen && (
        <div className="popup-box">
          <h3>Feeling lucky today?</h3>
          <p>Try to answer this question correctly and win a prize!</p>
          <button onClick={() => setIsOpen1(!isOpen1)}>
            <ArrowRight className="arrow-icon" />
          </button>
        </div>
      )}
      {isOpen1 && (
        <div className="overlay">
          <div className="question-box">
            <button
              className="question-box-button"
              onClick={() => {
                setIsOpen1(!isOpen1);
                setIsOpen(!isOpen);
              }}
            >
              <X className="arrow-icon" />
            </button>
            <h3>Question of the day!</h3>
            <p>
              In the upcoming match between{" "}
              <strong style={{ color: "#ff0000" }}>Real Madrid</strong> and{" "}
              <strong style={{ color: "#ff0000" }}>FC Barcelona</strong> which
              team do you think will win?
            </p>
            <div className="radio-input">
              <label className="label">
                <input
                  type="radio"
                  name="value-radio"
                  value="Real Madrid"
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    setErrorMessage(""); // Clear error when a team is selected
                  }}
                />
                Real Madrid
              </label>

              <label className="label">
                <input
                  type="radio"
                  name="value-radio"
                  value="FC Barcelona"
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    setErrorMessage(""); // Clear error when a team is selected
                  }}
                />
                FC Barcelona
              </label>
            </div>

            {/*Error message if nothing is selected*/}
            {errorMessage && (
              <p
                style={{
                  fontSize: "16px",
                  textAlign: "center",
                  marginBottom: "15px",
                  opacity: "0.4",
                }}
              >
                {errorMessage}
              </p>
            )}

            <button
              className="confirm-question"
              onClick={() => {
                if (!selectedTeam) {
                  setErrorMessage("Please select a team before confirming.");
                  return;
                }

                // Proceed
                console.log("Confirmed:", selectedTeam);
                setIsOpen1(false);
                setIsOpen(false);
              }}
            >
              Confirm Selection
            </button>
            {!isLoggedIn && (
              <p
                style={{
                  fontSize: "16px",
                  marginTop: "10px",
                  textAlign: "center",
                  opacity: "0.4",
                }}
              >
                *Only registered users can win prizes from answering questions.
                <f
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleLogin()}
                >
                  {" "}
                  LOGIN
                </f>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default BetOverlay;
