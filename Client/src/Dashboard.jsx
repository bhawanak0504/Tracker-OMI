import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeartbeat, faUser, faCalendar, faPhotoVideo, faSmile, faMeh, faFrown, faSadCry } from '@fortawesome/free-solid-svg-icons'; // Import the icons
import './Dashboard.css'; // Import your CSS for styling
import shoppingIcon from './assets/shopping.png'; // Replace with the path to your shopping icon
import aiIcon from './assets/ai-icon.png'; // Replace with the path to your AI assistance icon
import AIChatbot from './AIChatbot';
import visualizationImage from './assets/3d-visualization.png';
import mentalCareImage from './assets/mental-care.png';
import virtualConsultationImage from './assets/virtual-consultation.png';
import communityForumImage from './assets/community-forum.png';
import maternityInsuranceImage from './assets/maternity-insurance.png';
import dietPlannerImage from './assets/diet-planner.png';
import waving from './assets/waving.png';
import happyIcon from './assets/happy.png';
import cryingIcon from './assets/crying.png';
import angryIcon from './assets/angry.png';
import sadIcon from './assets/sad.png';
import { NavLink } from 'react-router-dom';





const MyComponent = () => {
    const [suc, setSuc] = useState("");
    const [username, setUsername] = useState(""); // State for username
    const navigate = useNavigate();
    const [feeling, setFeeling] = useState(""); // State for selected feeling
    const [selectedFeelings, setSelectedFeelings] = useState([]); // State for selected feelings
    const [showFeelingQuestion, setShowFeelingQuestion] = useState(true); // State to control the visibility of the question

    useEffect(() => {
        axios.get('http://localhost:3001/dashboard', { withCredentials: true })
            .then(res => {
                if (res.data.message === 'Success') {
                    setUsername(res.data.username); // Set username from response
                } else {
                    navigate('/login');
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, [navigate]);

  
const feelings = [
    { label: "happy", icon: happyIcon },
    { label: "crying", icon: cryingIcon },
    { label: "angry", icon: angryIcon },
    { label: "sad", icon: sadIcon },
]; // Array of feelings with icons

    const handleFeelingChange = (e) => {
        const value = e.target.value;
        if (!selectedFeelings.includes(value)) {
            setSelectedFeelings(prev => [...prev, value]); // Add feeling to the selected list
        }
    };

    useEffect(() => {
        if (selectedFeelings.length > 0) {
            setFeeling(selectedFeelings.join(", ")); // Join selected feelings
            setShowFeelingQuestion(false); // Hide the question when at least one feeling is selected
        }
    }, [selectedFeelings]);

    const handleAIChatbotClick = () => {
        navigate('/ai-chatbot'); // Redirect to AI Chatbot page
    };

    const handleShoppingCartClick = () => {
        navigate('/shopping-cart'); // Redirect to Shopping Cart page (you can create this route)
    };
     
 
   
    const handleCommunityForumClick = () => {
        navigate('/community-forum');
    };

    const handleVirtualConsultationClick = () => {
        navigate('/virtual-consultation');
    };


    const handleMaternityInsuranceClick = () => {
        navigate('/maternity-insurance');
    };
  

    const handleDietPlannerClick = () => {
        navigate('/diet-planner');
    };
    
    const handleMentalCareClick = () => {
        navigate('/mental-care');
    };
  
    const handleDVisualizationClick = () => {
        navigate('/3d-visualizations');
    };
    const handleResourcesClick = () => {
        navigate('/educational-resource');
    };
  
    const handleCalendarClick = () => {
        navigate('/calendar');
    };
  
    const handleTrackerClick = () => {
        navigate('/tracker-tools');
    };
    const handleProfileClick = () => {
        navigate('/profile');
    };
  

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
            <h1>
  Hello {username}!
  <img 
    src={waving} 
    alt="Waving Hand" 
    className="waving-hand-icon" 
  />
</h1>
<p>{suc && <span>{suc}</span>}</p>


                {/* Conditionally render the feeling question */}
                {showFeelingQuestion && (
                    <div>
                        <div className="fell"><p>How do you feel today?</p></div>
                       <div className="checkbox-group">
    {feelings.map(feel => (
        <label key={feel.label} className="checkbox-label">
            <input
                type="checkbox"
                value={feel.label}
                onChange={handleFeelingChange}
                disabled={selectedFeelings.includes(feel.label)} // Disable if already selected
            />
            <img 
                src={feel.icon} 
                alt={feel.label} 
                style={{ width: '20px', marginRight: '8px' }} 
            /> {/* Use <img> tag for the icon */}
            {feel.label.charAt(0).toUpperCase() + feel.label.slice(1)} {/* Capitalize first letter */}
        </label>
    ))}
</div>

                    </div>
                )}

                {/* Show the selected feelings after selection */}
                {feeling && <div className="fell2"><p>You feel: {feeling}!</p></div>}
            </header>
            <div className="dashboard-options">
            <div className="option-card" onClick={handleDVisualizationClick}>
        <img src={visualizationImage} alt="3-D Visualization" />
        3-D Visualization
    </div>
    <div className="option-card" onClick={handleMentalCareClick}>
        <img src={mentalCareImage} alt="Mental Care" />
        Mental Care
    </div>
    <div className="option-card" onClick={handleVirtualConsultationClick}>
        <img src={virtualConsultationImage} alt="Virtual Consultation" />
        Virtual Consultation
    </div>
    <div className="option-card" onClick={handleCommunityForumClick}>
        <img src={communityForumImage} alt="Community Forum" />
        Community Forum
    </div>
    <div className="option-card" onClick={handleMaternityInsuranceClick}>
        <img src={maternityInsuranceImage} alt="Maternity Insurance" />
        Maternity Insurance
    </div>
    <div className="option-card" onClick={handleDietPlannerClick}>
        <img src={dietPlannerImage} alt="Diet Planner" />
        Diet Planner
    </div>
</div>


            <div className="icons-container">
            <img src={shoppingIcon} alt="Shopping" className="icon" onClick={handleShoppingCartClick} /> {/* Attach click handler */}
                <img src={aiIcon} alt="AI Assistance" className="icon" onClick={handleAIChatbotClick} /> {/* Attach click handler */}

            </div>

            {/* Footer Section */}
            <footer className="footer">
            <NavLink to="/dashboard" className="footer-btn" activeClassName="active-icon">
                <FontAwesomeIcon icon={faHome} />
            </NavLink>
            <div className="footer-btn" onClick={handleCalendarClick}>
                <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="footer-btn" onClick={handleTrackerClick}>
                <FontAwesomeIcon icon={faHeartbeat} />
            </div>
            <div className="footer-btn" onClick={handleProfileClick}>
                <FontAwesomeIcon icon={faUser} />
           </div>

            <div className="footer-btn" onClick={handleResourcesClick}>
            <FontAwesomeIcon icon={faPhotoVideo} />
    </div>
                
           
        </footer>
        </div>
    );
};

export default MyComponent;
