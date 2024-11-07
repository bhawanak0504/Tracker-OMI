import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';
import image7 from '../assets/image7.png';
import image8 from '../assets/image8.png';
import image9 from '../assets/image9.png';

import './Onboarding.css'; // Import your CSS styles

function Onboarding() {
  const [step, setStep] = useState(0);

  console.log(image1); // This should log the correct path

  // Onboarding steps content
  const onboardingSteps = [
    {
      title: "Welcome to Maternity & Baby Hub!",
      content: "Your one-stop solution for expectant and new mothers. Our app is designed to help you track your health and your baby's development.",
      image: image1,
    },
    {
      title: "Explore Our Features",
      content: "Discover the various features we offer to make your journey easier.",
      images: [
        image2, // First image of step 2
        image3, // Second image of step 2
        image4, // Third image of step 2
        image5, // Fourth image of step 2
      ],
    },
    {
      title: "Get Started Today",
      content: "Create an account to start your journey with us. Access valuable resources, virtual consultations, and more!",
      images: [
        image6, // Placeholder for step 3 images
        image7,
        image8,
        image9,
      ],
    },
  ];

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    setStep(onboardingSteps.length - 1); // Skip to the last step
  };

  return (
    <div className="onboarding-container">
      <h1 className="onboarding-title">{onboardingSteps[step].title}</h1>
  
      {step === 0 ? (
        <div className="image-container">
          <img src={onboardingSteps[step].image} alt="Onboarding Step 1" className={`onboarding-image onboarding-image1`} />
        </div>
      ) : step === 1 ? (
        <div className="image-grid">
          {onboardingSteps[step].images.map((img, index) => (
            <div className="image-container" key={index}>
              <img src={img} alt={`Onboarding Step ${step + 1} Image ${index + 1}`} className="grid-image" />
            </div>
          ))}
        </div>
      ) : (
        <div className="image-grid">
          {onboardingSteps[step].images.map((img, index) => (
            <div className="image-container" key={index}>
              <img src={img} alt={`Onboarding Step ${step + 1} Image ${index + 1}`} className="grid-image" />
            </div>
          ))}
        </div>
      )}
      
  
      <p>{onboardingSteps[step].content}</p>
  
      {/* Hide buttons on the last step */}
      {step < onboardingSteps.length - 1 && (
        <div className="onboarding-buttons">
          <button onClick={handleSkip}>Skip to Login</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
  
      {/* Display login and registration links at the end of the last step */}
      {step === onboardingSteps.length - 1 && (
        <div className="final-buttons">
          <Link to="/login">
            <button className="home-button">Go to Login</button>
          </Link>
          <Link to="/register">
            <button className="home-button">Go to Register</button>
          </Link>
        </div>
      )}
  
      {/* Indicator for the onboarding steps */}
      <div className="step-indicator">
        {onboardingSteps.map((_, index) => (
          <span key={index} className={`dots ${step === index ? 'active' : ''}`}></span>
        ))}
      </div>
    </div>
  );
}

export default Onboarding;



