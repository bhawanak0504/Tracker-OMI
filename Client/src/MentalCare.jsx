import React, { useState } from 'react';
import './MentalCare.css';
import exerciseAvatar from './assets/lotus.png';
import gameAvatar from './assets/game.png';
import babyAvatar from './assets/baby.png';
import musicAvatar from './assets/music.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faHome, 
  faCalendar, 
  faHeartbeat, 
  faUser, 
  faPhotoVideo 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import VirtualGarden from './VirtualGarden'; // Import the Virtual Garden component
import NewGame from './NewGame'; // Import your new game component
import virtualGardenImage from './assets/virtual-garden.png'; // Replace with your actual path
import newGameImage from './assets/new-game.png'; // Replace with your actual path
import EnergeticExercise from './EnergeticExercise'; // Import the EnergeticExercise component
import logo1 from './assets/logos1.gif'; // Adjust the path accordingly
import logo2 from './assets/logos2.gif'; // Adjust the path accordingly
import logo3 from './assets/logos3.gif';
import logo4 from './assets/logos4.gif';
import logo5 from './assets/logos5.gif';
import logo6 from './assets/logos6.gif'; // Adjust the path accordingly

const MentalCare = () => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [currentGame, setCurrentGame] = useState(null);
    const navigate = useNavigate();
  
    const handleBackClick = () => {
      navigate('/dashboard');
    };
  
    const activities = [
      {
        title: 'Enjoyable Games',
        avatar: gameAvatar,
        description: 'Play a simple game to relax and have fun!',
        className: 'activity-card-games',
        content: (
          <div className="games-row">
            <div className="game-option" onClick={() => setCurrentGame('VirtualGarden')}>
              <img src={virtualGardenImage} alt="Virtual Garden" className="game-image" />
              <p>Virtual Garden</p>
            </div>
            <div className="game-option" onClick={() => setCurrentGame('NewGame')}>
              <img src={newGameImage} alt="New Game" className="game-image" />
              <p>New Game</p>
            </div>
          </div>
        ),
      },
      {
        title: 'Energetic Exercise',
        avatar: exerciseAvatar,
        description: 'Follow along with gentle exercises!',
        className: 'activity-card-exercise',
        content: <EnergeticExercise />,
      },
      {
        title: 'Cute Baby Videos',
        avatar: babyAvatar,
        description: 'Watch adorable baby videos!',
        className: 'activity-card-baby',
        content: (
          <div className="video-gallery">
            <a href="https://www.youtube.com/shorts/16ihdcMghHs" target="_blank" rel="noopener noreferrer">
              <img src={logo1} alt="Cute Baby Video 1" className="video-logo" />
            </a>
            <a href="https://www.youtube.com/shorts/z4iJKhQYwOY" target="_blank" rel="noopener noreferrer">
              <img src={logo2} alt="Cute Baby Video 2" className="video-logo" />
            </a>
            <a href="https://www.youtube.com/shorts/V0IgTCvdl2M" target="_blank" rel="noopener noreferrer">
              <img src={logo3} alt="Cute Baby Video 3" className="video-logo" />
            </a>
          </div>
        )
      },
      
      {
        title: 'Relaxation Music',
        avatar: musicAvatar,
        description: 'Enjoy relaxing tunes for peace of mind.',
        className: 'activity-card-music',
        content: (
          <div className="video-gallery">
            <a href="https://www.youtube.com/watch?v=CoT3UWHL4fM" target="_blank" rel="noopener noreferrer">
              <img src={logo4} alt="Cute Baby Video 1" className="video-logo" />
            </a>
            <a href="https://soundcloud.com/meditationspirit/soothing-piano-song?in=pregnantmother/sets/guided-meditation-for-pregnant&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" target="_blank" rel="noopener noreferrer">
              <img src={logo5} alt="Cute Baby Video 2" className="video-logo" />
            </a>
            <a href="https://soundcloud.com/pregnantmother/pregnancy-music-for-labor?in=pregnantmother/sets/guided-meditation-for-pregnant&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" target="_blank" rel="noopener noreferrer">
              <img src={logo6} alt="Cute Baby Video 3" className="video-logo" />
            </a>
          </div>
        )
        
      }
    ];
  
    return (
      <div className="mental-care-container">
        <div className="mental-header">
          <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" onClick={handleBackClick} />
          <h2 className="centered-title">Mental Care</h2>
        </div>
  
        <div className="main-content">
          <p className="description">Choose an activity to relax and stay positive during your pregnancy.</p>
  
          <div className="activity-options">
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`activity-card ${activity.className} ${selectedActivity === index ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedActivity(index);
                  setCurrentGame(null); // Reset current game when selecting a new activity
                }}
              >
                <img src={activity.avatar} alt={activity.title} className="activity-avatar" />
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </div>
            ))}
          </div>
  
          {selectedActivity !== null && (
            <div className="activity-content">
              <h2>{activities[selectedActivity].title}</h2>
              {activities[selectedActivity].content}
  
              {/* Render the selected game if applicable */}
              {currentGame === 'VirtualGarden' && <VirtualGarden />}
              {currentGame === 'NewGame' && <NewGame />}
  
              <button onClick={() => { setSelectedActivity(null); setCurrentGame(null); }} className="close-btn">Close</button>
            </div>
          )}
        </div>
  
        <footer className="footer">
          <button className="footer-btn active-icon"><FontAwesomeIcon icon={faHome} /></button>
          <button className="footer-btn"><FontAwesomeIcon icon={faCalendar} /></button>
          <button className="footer-btn"><FontAwesomeIcon icon={faHeartbeat} /></button>
          <button className="footer-btn"><FontAwesomeIcon icon={faUser} /></button>
          <button className="footer-btn"><FontAwesomeIcon icon={faPhotoVideo} /></button>
        </footer>
      </div>
    );
  };
  
  export default MentalCare;
  