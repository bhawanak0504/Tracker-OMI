import React, { useState } from 'react';
import './PregnancyMoodTracker.css';
import { FaSmile, FaMeh, FaFrown, FaPlus, FaGrinStars, FaSpa, FaExclamationTriangle, FaBed, FaCheckCircle, FaBomb, FaHeart, FaHandsHelping, FaAngry, FaQuestionCircle, FaBullseye, FaLightbulb} from 'react-icons/fa';
import image4 from './assets/easy.png';
const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [craving, setCraving] = useState('');
  const [reflection, setReflection] = useState('');

  const moods = [
    { mood: 'Happy', icon: <FaSmile />, color: '#FFD700' },         // Gold
    { mood: 'Neutral', icon: <FaMeh />, color: '#B0C4DE' },        // Light Steel Blue
    { mood: 'Sad', icon: <FaFrown />, color: '#4682B4' },          // Steel Blue
    { mood: 'Excited', icon: <FaGrinStars />, color: '#FF6347' },  // Tomato
    { mood: 'Relaxed', icon: <FaSpa />, color: '#98FB98' },        // Pale Green
    { mood: 'Anxious', icon: <FaExclamationTriangle />, color: '#FF4500' }, // Orange Red
    { mood: 'Tired', icon: <FaBed />, color: '#778899' },          // Light Slate Gray
    { mood: 'In Love', icon: <FaHeart />, color: '#FF69B4' },      // Hot Pink
    { mood: 'Angry', icon: <FaAngry />, color: '#DC143C' },        // Crimson
  ];
  

  const handleAddEntry = () => {
    if (selectedMood) {
      const entry = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: selectedMood,
        craving: craving,
        reflection: reflection,
      };
      setMoodEntries([entry, ...moodEntries]);
      setSelectedMood('');
      setCraving('');
      setReflection('');
    }
  };

  const getMoodColor = (mood) => moods.find((m) => m.mood === mood)?.color || '#ccc';

  return (
    <div className="pregnancy-mood-tracker">
      <h1>Mood Tracker</h1>
      <img src={image4} alt="pregnancy" className="pregnancy-image" width='300'/>
      <div className="mood-selection">
        <h2>Select your mood:</h2>
        <div className="mood-buttons">
          {moods.map((m, index) => (
            <button
              key={index}
              style={{ backgroundColor: selectedMood === m.mood ? m.color : '#f0f0f0' }}
              onClick={() => setSelectedMood(m.mood)}
              className="mood-button"
            >
              {m.icon} {m.mood}
            </button>
          ))}
        </div>

        <div className="craving-input">
          <input
            type="text"
            placeholder="What are you craving?"
            value={craving}
            onChange={(e) => setCraving(e.target.value)}
          />
        </div>

        <div className="reflection-input">
          <textarea
            placeholder="Any reflections or notes?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows="3"
          />
        </div>

        <button className="add-button" onClick={handleAddEntry}>
          <FaPlus /> Add Entry
        </button>
      </div>

      <div className="mood-calendar">
        <h2>Daily Mood Overview</h2>
        <div className="day">
          {moodEntries.map((entry, index) => (
            <div
              key={index}
              className="entry"
              style={{ backgroundColor: getMoodColor(entry.mood) }}
            >
              <span>{entry.date} - {entry.time}</span>
              <p>Mood: {entry.mood}</p>
              {entry.craving && <small>Craving: {entry.craving}</small>}
              {entry.reflection && <small>Reflection: {entry.reflection}</small>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;