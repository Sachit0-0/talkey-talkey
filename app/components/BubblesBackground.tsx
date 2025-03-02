import React from "react";
import "../styles/BubblesBackground.css";

const BubblesBackground = () => {
  return (
    <div className="wrapper">
  
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index}>
          <span className="dot"></span>
        </div>
      ))}
    </div>
  );
};

export default BubblesBackground;
