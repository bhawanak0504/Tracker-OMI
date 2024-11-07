import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faCalendar, faHeartbeat, faUser, faPhotoVideo, faBell, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'; // Correct icon import
import './Resources.css';

function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [likes, setLikes] = useState({}); 
  const navigate = useNavigate(); 

  // Mock data for videos and articles
  const videos = [
    { id: 1, type: 'video', title: 'Pregnancy Yoga', description: 'Helps with morning sickness.', url: 'https://www.youtube.com/watch?v=-3bvlFKeLRE' },
    { id: 2, type: 'video', title: 'Pregnancy Exercises', description: 'Safe exercises during pregnancy.', url: 'https://www.youtube.com/watch?v=Ia6dNwVs1M8' },
    { id: 3, type: 'video', title: 'Breathing Techniques for Labor', description: 'Learn effective breathing techniques for labor.', url: 'https://www.youtube.com/watch?v=oXYhM26ACAU' },
    { id: 4, type: 'video', title: 'Meditation for Expectant Mothers', description: 'Guided meditation to relax and connect with your baby.', url: 'https://www.youtube.com/watch?v=UcCaQ3hKDaA' },
    { id: 5, type: 'video', title: 'Preparing for Baby\'s Arrival', description: 'Essential tips for getting ready for your newborn.', url: 'https://www.youtube.com/watch?v=xoFLrM_XQ7I' },
    { id: 6, type: 'video', title: 'Postpartum Exercises', description: 'Safe exercises to regain strength after delivery.', url: 'https://www.youtube.com/watch?v=Euctr8U2PEE' },
    { id: 7, type: 'video', title: 'Infant Care 101', description: 'Essential tips for caring for your newborn.', url: 'https://www.youtube.com/watch?v=-CWJYxIvoFQ' },
    { id: 8, type: 'video', title: 'Baby Sleep Tips', description: 'Learn how to help your baby sleep better.', url: 'https://www.youtube.com/watch?v=se00vkpziuU' }
  ];

  const articles = [
    { id: 1, type: 'article', title: 'Pregnancy Tips', description: 'Tips for a healthy pregnancy.', url: 'https://www.healthline.com/health/pregnancy/healthy-pregnancy' },
    { id: 2, type: 'article', title: 'Nutrition during Pregnancy', description: 'Nutritional tips for expectant mothers.', url: 'https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy-nutrition/art-20045082' },
    { id: 3, type: 'article', title: 'Understanding Prenatal Vitamins', description: 'A guide to essential prenatal vitamins.', url: 'https://www.moneycontrol.com/health-and-fitness/diet-guide-heres-how-much-nutrition-you-need-according-to-your-age-article-12841386.html' },
    { id: 4, type: 'article', title: 'Managing Stress During Pregnancy', description: 'Tips for managing stress and anxiety.', url: 'https://zeenews.india.com/health/pcos-management-before-and-during-pregnancy-expert-tips-for-a-healthy-journey-2805961' },
    { id: 5, type: 'article', title: 'Postpartum Care for New Moms', description: 'Important care tips for new mothers after childbirth.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK565875/' },
    { id: 6, type: 'article', title: 'Breastfeeding Basics', description: 'A guide to breastfeeding for new mothers.', url: 'https://www.uptodate.com/contents/breastfeeding-guide-beyond-the-basics' },
    { id: 7, type: 'article', title: 'Bonding with Your Baby', description: 'Activities to enhance bonding with your newborn.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5330336/' },
    { id: 8, type: 'article', title: 'Returning to Work After Baby', description: 'Tips for transitioning back to work after maternity leave.', url: 'https://www.babycenter.com/baby/postpartum-health/when-can-i-go-back-to-work-after-delivery_1156149' }
  ];

  useEffect(() => {
    const allResources = [...articles, ...videos]; // Combine both articles and videos
    setResources(allResources);
    setFilteredArticles(articles);
    setFilteredVideos(videos);

    const initialLikes = {};
    allResources.forEach(resource => {
      initialLikes[resource.id] = 0; 
    });
    setLikes(initialLikes);
  }, []);

  const handleSearch = (query) => {
    const filteredArticles = resources.filter(
      resource => resource.type === 'article' && resource.title.toLowerCase().includes(query.toLowerCase())
    );
    const filteredVideos = resources.filter(
      resource => resource.type === 'video' && resource.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredArticles(filteredArticles);
    setFilteredVideos(filteredVideos);
  };

  const handleSave = (resource) => {
    setSavedResources(prevSaved => {
      if (prevSaved.some(saved => saved.id === resource.id)) {
        alert('This resource is already saved!');
        return prevSaved;
      }
      return [...prevSaved, resource];
    });
    alert(`${resource.title} has been saved for later!`); // Corrected this line
  };

  const handleLike = (resourceId) => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [resourceId]: prevLikes[resourceId] + 1,
    }));
  };

  const handleBackClick = () => {
    navigate(-1); 
  };

  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|&v=|\/videos\/)([^#&?]{11}).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="resources-container">
      <div className="resources-header">
      <h2 className="centered-title">Educational Resources & Articles</h2>
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          className="back-arrow" 
          onClick={handleBackClick}  
        />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSearch(e.target.value); }} className="rsearch-bar">
        <input
          type="text"
          placeholder="Search Videos & Articles"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className="rfa-magnifying-glass" />
      </form>

      <div className="rvideos-section">
        <div className="rvideo"><h4>Videos</h4></div>
        <div className="resources-list">
          {filteredVideos.length === 0 ? (
            <div className="no"><p>No videos found.</p></div>
          ) : (
            filteredVideos.map(video => {
              const youtubeId = extractYoutubeId(video.url);
              return (
                <div key={video.id} className="resource-item">
                 <div className="rtitle"> <h3>{video.title}</h3></div>
                 <div className="no"><p>{video.description}</p></div> 
                  {youtubeId && (
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${youtubeId}`} // Corrected this line
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                <div className="rsave"><button onClick={() => handleSave(video)}>Save</button></div>
<div className="rlike"><button onClick={() => handleLike(video.id)}>Like {likes[video.id] || 0}</button></div>

                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rarticles-section">
        <div className="rvideo"><h4>Articles</h4></div>
        <div className="resources-list">
          {filteredArticles.length === 0 ? (
           <div className="no"><p>No articles found.</p></div> 
          ) : (
            filteredArticles.map(article => (
              <div key={article.id} className="resource-item">
                <div className="rtitle"><h3>{article.title}</h3></div>
                <div className="n"><p>{article.description}</p></div>
                <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                <div className="rsave"><button onClick={() => handleSave(article)}>Save</button></div>
               <div className="rlike"> <button onClick={() => handleLike(article.id)}>Like {likes[article.id] || 0}</button></div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="saved-resources">
       <div className="rvideo"><h4>Saved Resources</h4></div> 
        {savedResources.length === 0 ? (
         <div className="no"><p>No resources saved.</p></div> 
        ) : (
          savedResources.map(resource => (
            <div key={resource.id} className="saved-resource-item">
             <div className="rvideo"><h4>{resource.title}</h4></div> 
              <div className="no"><p>{resource.description}</p></div>
            </div>
          ))
        )}
      </div>
      
      <footer className="footer">
          <button className="footer-btn "><FontAwesomeIcon icon={faHome} /></button>
          <button className="footer-btn"><FontAwesomeIcon icon={faCalendar} /></button>
          <button className="footer-btn"><FontAwesomeIcon icon={faHeartbeat} /></button>
          <button className="footer-btn"><FontAwesomeIcon icon={faUser} /></button>
          <button className="footer-btn active-icon"><FontAwesomeIcon icon={faPhotoVideo} /></button>
        </footer>
    </div>
  );
}

export default Resources;
