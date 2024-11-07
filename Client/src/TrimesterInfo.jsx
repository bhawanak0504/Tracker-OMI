import React, { useState } from 'react';
import './TrimesterInfo.css';

// Import your video assets
import video1 from './assets/videos/Month1.mp4';
// Import other videos as necessary

const TrimesterInfo = ({ month, week }) => {
  const [selectedTrimester, setSelectedTrimester] = useState(null);

  const getTrimester = () => {
    if (week >= 1 && week <= 12) return 'First Trimester';
    if (week >= 13 && week <= 26) return 'Second Trimester';
    if (week >= 27 && week <= 40) return 'Third Trimester';
    return null;
  };

  const trimester = getTrimester();

  if (!trimester) {
    return <p className="error-message">Please enter a valid week between 1 and 40.</p>;
  }

  const trimesterContent = {
    'First Trimester': {
      description: 'Your baby is developing rapidly! It’s an exciting time as early facial features and limbs start to form.',
      tips: "Stay hydrated and take care of yourself. Remember, this is a journey!",
      videos: [
        { title: 'Month 1: Early Embryo Development', url: video1 },
        { title: 'Month 2: Limb Bud Formation', url: video1 },
        { title: 'Month 3: Facial Feature Development', url: video1 }
      ]
    },
    'Second Trimester': {
      description: 'You may begin to feel movements. Your baby is growing and developing more distinct features!',
      tips: "Enjoy the movement! This is a great time to bond with your baby.",
      videos: [
        { title: 'Month 4: Feature Definition', url: video1 },
        { title: 'Month 5: Growth and Size', url: video1 },
        { title: 'Month 6: Baby Movements', url: video1 }
      ]
    },
    'Third Trimester': {
      description: 'Your baby is preparing for birth! Exciting times ahead as you get ready to meet your little one.',
      tips: "Start packing your hospital bag and enjoy these last moments of pregnancy.",
      videos: [
        { title: 'Month 7: Final Developments', url: video1 },
        { title: 'Month 8: Birth Preparation', url: video1 },
        { title: 'Month 9: Complete Development', url: video1 }
      ]
    }
  };

  const { description, tips, videos } = trimesterContent[trimester];

  const handleTrimesterClick = () => {
    setSelectedTrimester(selectedTrimester === trimester ? null : trimester);
  };

  return (
    <div className="trimester-info">
      <div className="tri-head"><h4 className="trimester-title">{trimester} Overview:</h4></div>
      <div className="tip">
        <p>{description}</p>
        <p><strong>Tip:</strong> {tips}</p>
      </div>
      <div className="video-section">
        <div className="trimester-card" onClick={handleTrimesterClick}>
          <h5 className="card-title">{trimester} Experience</h5>
          <div className="tip"><p>Click on the card for a virtual experience! 🎧</p></div>
        </div>
        {selectedTrimester === trimester && videos.map((video, index) => (
          <div key={index} className="video-card">
            <h5 className="video-title">{video.title}</h5>
            <video className="video-preview" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrimesterInfo;
