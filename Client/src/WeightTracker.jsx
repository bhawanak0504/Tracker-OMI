import React, { useState } from 'react';
import './WeightTracker.css';
import { FaPlus, FaTrash, FaEdit, FaChartLine } from 'react-icons/fa';
import image3 from './assets/weight.png';

const WeightTracker = () => {
  const [weightEntries, setWeightEntries] = useState([]);
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddOrUpdateEntry = () => {
    if (currentWeight && goalWeight) {
      const entry = {
        date: new Date().toLocaleDateString(),
        weight: parseFloat(currentWeight),
      };
      
      if (editingIndex !== null) {
        const updatedEntries = [...weightEntries];
        updatedEntries[editingIndex] = entry;
        setWeightEntries(updatedEntries);
        setEditingIndex(null);
      } else {
        setWeightEntries([entry, ...weightEntries]);
      }

      setCurrentWeight('');
    }
  };

  const handleEditEntry = (index) => {
    setEditingIndex(index);
    setCurrentWeight(weightEntries[index].weight);
  };

  const handleDeleteEntry = (index) => {
    setWeightEntries(weightEntries.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentWeight('');
    }
  };

  const handleReset = () => {
    setWeightEntries([]);
    setCurrentWeight('');
    setGoalWeight('');
    setEditingIndex(null);
  };

  const getProgressPercentage = () => {
    if (!weightEntries.length || !goalWeight) return 0;
    const latestWeight = weightEntries[0].weight;
    const percentage = Math.max(
      0,
      Math.min(100, ((goalWeight - latestWeight) / goalWeight) * 100)
    );
    return percentage;
  };

  const getMotivationalMessage = () => {
    if (!weightEntries.length) return 'Start tracking your progress!';
    const latestWeight = weightEntries[0].weight;
    const difference = goalWeight - latestWeight;
    if (difference > 0) return `Keep going! Only ${difference} kg to reach your goal! 🎉`;

    if (difference === 0) return 'Congratulations! You’ve reached your goal weight! 🥳';
    return 'You’ve surpassed your goal! Amazing job! 🌟';
  };

  return (
    <div className="weights-tracker">
      <div className="whead"><h1>Weight Tracker <FaChartLine /></h1></div>
      <div className="wimage"> <img src={image3} alt="Weight Tracker" width='300'/></div>
      <div className="inputsssss-section">
        <input
          type="number"
          placeholder="Enter current weight (kg)"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Set your goal weight (kg)"
          value={goalWeight}
          onChange={(e) => setGoalWeight(e.target.value)}
        />
        <button className="addss-button" onClick={handleAddOrUpdateEntry}>
          <FaPlus /> {editingIndex !== null ? 'Update' : 'Add Entry'}
        </button>
        {/* Reset Button */}
        <button className="resets-button" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="chartss-section">
        <h2>Progress Chart</h2>
        <div className="charts">
          {weightEntries.map((entry, index) => (
            <div key={index} className="bars" style={{ height: `${entry.weight * 2}px` }}>
              <span>{entry.weight} kg</span>
            </div>
          ))}
        </div>
      </div>

      {weightEntries.length > 0 && (
        <>
          <div className="progresss-bar">
            <div className="progress" style={{ width: `${getProgressPercentage()}%` }} />
          </div>
          <div className="wmotivational-message">
            <p>{getMotivationalMessage()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default WeightTracker;

