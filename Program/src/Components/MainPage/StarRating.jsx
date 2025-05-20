import React from "react";

const StarRating = ({ rating }) => {
  const maxStars = 5; // Maximum number of stars
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 24 24"
        style={{
          width: "30px",
          height: "30px",
          alignContent: "center",
          marginBottom: "15px",
          fill: i <= rating ? "#ffcc00" : "#e4e4e4", // Filled color for rated stars, gray for empty
        }}
      >
        <path d="M12 2.5L9.45 8.5L3 9.06L7.725 13.39L6.25 19.82L12 16.5L17.75 19.82L16.275 13.39L21 9.06L14.55 8.5L12 2.5ZM12 4.75L14 9.33L18.7 9.75L15 13.07L16.18 17.75L12 15.16L7.82 17.75L9 13.07L5.3 9.75L10 9.33L12 4.75Z"></path>
      </svg>
    );
  }

  return <div>{stars}</div>;
};

export default StarRating;
