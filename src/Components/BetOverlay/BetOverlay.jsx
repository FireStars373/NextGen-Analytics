import { useState } from "react";
import "./BetOverlay.css";
import { Star, ArrowRight } from "lucide-react";

const BetOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);

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
        <div className="popup-box">
          <h1></h1>
        </div>
      )}
    </>
  );
};
export default BetOverlay;
