import React from "react";
import { X } from "react-feather";
import "./BackgroundSelector.css";

function BackgroundSelector({ setShowBackgroundSelector, setBackground, resetBackground, images }) {
  const handleSelectBackground = (image) => {
    setBackground(image);
    setShowBackgroundSelector(false);
  };

  return (
    <div className="background-selector-modal">
      <div className="background-selector-content">
        <X
          className="close-icon"
          onClick={() => setShowBackgroundSelector(false)}
        />
        <h3>Select Background</h3>
        <div className="background-selector-grid">
          <div className="default-color" onClick={() => {
              resetBackground();
              setShowBackgroundSelector(false);
            }}>
              Default Color
          </div>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Background ${index}`}
              onClick={() => handleSelectBackground(image)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BackgroundSelector;
