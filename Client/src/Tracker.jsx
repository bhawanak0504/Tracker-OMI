import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrackingToolCard from './TrackingToolCard';
import KickCounter from './KickCounter';
import './Tracker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBell,
  faHome,
  faCalendar,
  faHeartbeat,
  faUser,
  faPhotoVideo
} from '@fortawesome/free-solid-svg-icons';
import i2 from './assets/baby-feet.png';
import i3 from './assets/weight.png';
import i4 from './assets/easy.png';
const TrackingTools = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="tracking-tools-container">
      <div className="tracking-tool-header">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          className="back-arrow" 
          onClick={handleBackClick}  
        />
        <h2 >Tracking Tools</h2>
        
      </div>

      <div className="tracker-box">
        
        <TrackingToolCard
          title="Kick Counter"
          backgroundColor="#53f953"
          buttonText="Count now"
          onClick={() => navigate('/kick-counter')}
          image={i2}
        />
        <TrackingToolCard
          title="Weight Tracker"
          backgroundColor="#ff4d4d"
          buttonText="Track now"
          onClick={() => navigate('/weight-tracker')}
          image={i3}
        />
        <TrackingToolCard
          title="Mood Tracker"
          backgroundColor="#4d88ff"
          buttonText="Track now"
          onClick={() => navigate('/mood-tracker')}
          image={i4}
        />
      </div>
      
      <footer className="footer">
        <button className="footer-btn " >
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="footer-btn" >
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <button className="footer-btn active-icon" >
          <FontAwesomeIcon icon={faHeartbeat} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faUser} />
        </button>
        <button className="footer-btn" >
          <FontAwesomeIcon icon={faPhotoVideo} />
        </button>
      </footer>
    </div>
  );
};

export default TrackingTools