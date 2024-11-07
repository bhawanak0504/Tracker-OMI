import React from 'react';

const TrackingToolCard = ({ title, backgroundColor, buttonText, onClick, image }) => {
  return (
    <div className="tracking-tool-card" style={{ backgroundColor }}>
      <img src={image} alt={title} className="tracking-tool-image" />
      <h3>{title}</h3>
      <button onClick={onClick}>{buttonText}</button>
    </div>
  );
};

export default TrackingToolCard;