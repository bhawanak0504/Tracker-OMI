import React, { useState, useEffect } from 'react';
import './VirtualGarden.css'; // Make sure you have relevant styles
import roseSeedling from './assets/rose_seedling.png'; // Replace with your image paths
import roseYoung from './assets/rose_young.png';
import roseBlooming from './assets/rose_blooming.png';
import sunflowerSeedling from './assets/sunflower_seedling.png';
import sunflowerYoung from './assets/sunflower_young.png';
import sunflowerBlooming from './assets/sunflower_blooming.png';

const plantsData = [
  {
    id: 1,
    name: 'Rose',
    growthTime: 5000, // 5 seconds to grow to the next stage
    images: [
      roseSeedling, // Seedling
      roseYoung,    // Young Plant
      roseBlooming  // Blooming Plant
    ],
  },
  {
    id: 2,
    name: 'Sunflower',
    growthTime: 7000, // 7 seconds
    images: [
      sunflowerSeedling,
      sunflowerYoung,
      sunflowerBlooming
    ],
  },
];

const VirtualGarden = () => {
  const [garden, setGarden] = useState(Array(9).fill(null)); // 3x3 grid for the garden
  const [planting, setPlanting] = useState(null); // Current plant to be planted
  const [message, setMessage] = useState('Hello! Let’s play a planting game!'); // Introductory message

  const handlePlantClick = (index) => {
    if (planting) {
      const newGarden = [...garden];
      newGarden[index] = { ...planting, growthStage: 0 }; // Start at the seedling stage
      setGarden(newGarden);
      setPlanting(null);
      setMessage(`You planted a ${planting.name}! Watch it grow!`);
    }
  };

  useEffect(() => {
    const growthIntervals = garden.map((plant, index) => {
      if (plant && plant.growthStage < 2) { // Check if plant is not fully grown
        return setTimeout(() => {
          const newGarden = [...garden];
          newGarden[index].growthStage += 1; // Advance the growth stage
          setGarden(newGarden);
        }, plant.growthTime);
      }
      return null;
    });

    return () => {
      growthIntervals.forEach((interval) => clearTimeout(interval)); // Cleanup timers on unmount
    };
  }, [garden]);

  const handleWaterClick = (index) => {
    if (garden[index]) {
      const newGarden = [...garden];
      newGarden[index].growthStage = Math.min(newGarden[index].growthStage + 1, 2); // Advance one stage, max to 2
      setGarden(newGarden);
      setMessage(`You watered the ${garden[index].name}!`);
    }
  };

  return (
    <div className="garden-container">
      <h2>Your Colorful Virtual Garden</h2>
      <p>{message}</p>
      <div className="plants-selection">
        {plantsData.map((plant) => (
          <button key={plant.id} onClick={() => setPlanting(plant)} className={`plant-btn ${plant.name.toLowerCase()}-btn`}>
            Plant {plant.name}
          </button>
        ))}
      </div>
      <div className="garden-grid">
        {garden.map((plant, index) => (
          <div
            key={index}
            className="garden-cell"
            onClick={() => handlePlantClick(index)}
          >
            {plant ? (
              <div>
                <img src={plant.images[plant.growthStage]} alt={plant.name} className="plant-image" />
                <button onClick={() => handleWaterClick(index)} className="water-btn">💧 Water</button>
              </div>
            ) : (
              <div className="empty-cell">🌱 Empty</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualGarden;
