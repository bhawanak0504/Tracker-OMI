import React, { useState, useEffect } from 'react';
import './KickCounter.css';
import { FaPlay, FaStop, FaRedo, FaFistRaised } from 'react-icons/fa';
import image2 from './assets/baby-feet.png';
import video from './assets/kick.mp3';

const KickCounter = () => {
  const [isCounting, setIsCounting] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('kickCounterHistory'));
    if (savedHistory && Array.isArray(savedHistory)) {
      setSessionHistory(savedHistory);
      console.log("Loaded session history from localStorage:", savedHistory);
    } else {
      console.log("No valid session history found in localStorage.");
    }
  }, []);

  // Save data to localStorage whenever sessionHistory changes
  useEffect(() => {
    if (sessionHistory.length > 0) { // Only save if there's actual data
      localStorage.setItem('kickCounterHistory', JSON.stringify(sessionHistory));
      console.log("Session history saved to localStorage:", sessionHistory);
    }
  }, [sessionHistory]);

  const handleStartSession = () => {
    setIsCounting(true);
    setKickCount(0);
  };

  const handleEndSession = () => {
    const timestamp = new Date().toLocaleString();
    const newSession = { kickCount, timestamp };
    // Save current session to history without clearing past data
    setSessionHistory([newSession, ...sessionHistory]);
    setIsCounting(false);
  };

  const handleKick = () => {
    setKickCount(prevCount => prevCount + 1);
    const audio = new Audio(video); // Play sound on kick
    audio.play().catch(error => console.error("Audio playback failed:", error));
  };

  const handleReset = () => {
    setKickCount(0); // Reset only the current session's kick count, not sessionHistory
  };

  return (
    <div className="KickCounter">
      <div className="kick-counter">
        <h1>Kick Counter</h1>
        <img src={image2} alt="Image 74" width="300" />
        <div className="kick-session">
          {isCounting ? (
            <>
              <h2 className="kick-count animated">{kickCount}</h2>
              <button className="kick-button" onClick={handleKick}>
                <FaFistRaised /> Register Kick
              </button>
              <button className="end-session-button" onClick={handleEndSession}>
                <FaStop /> End Session
              </button>
              <button className="reset-button" onClick={handleReset}>
                <FaRedo /> Reset
              </button>
            </>
          ) : (
            <button className="start-session-button" onClick={handleStartSession}>
              <FaPlay /> Start Counting Kicks
            </button>
          )}
        </div>

        {sessionHistory.length > 0 && (
          <div className="session-history">
            <h2>Past Kick Sessions</h2>
            <ul>
              {sessionHistory.map((session, index) => (
                <li key={index}>
                  <span>{session.timestamp}</span> - <strong>{session.kickCount} kicks</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sessionHistory.length > 0 && !isCounting && (
          <div className="motivational-message">
            <h3>Great job! Keep kicking!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default KickCounter;
