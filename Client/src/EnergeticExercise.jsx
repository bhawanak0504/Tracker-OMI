import React, { useState } from 'react';
import './EnergeticExercise.css'; // Make sure to create or update this CSS file

// Import images from your assets
import prenatalYogaTitleImage from './assets/prenatal-yoga-image.png';
import prenatalYogaGif from './assets/updowns.webp';
import waterAerobicsTitleImage from './assets/water-aerobics-image.png';
import waterAerobicsGif from './assets/squat.webp';

const EnergeticExercise = () => {
  const exercises = [
    {
      title: 'Prenatal Yoga',
      description: 'Follow along with gentle yoga poses to improve flexibility and strength.',
      titleImage: prenatalYogaTitleImage, // Use the imported image
      gifSrc: prenatalYogaGif, // Use the imported GIF
    },
    {
      title: 'Water Aerobics',
      description: 'Enjoy refreshing water exercises that are safe for you and your baby.',
      titleImage: waterAerobicsTitleImage, // Use the imported image
      gifSrc: waterAerobicsGif, // Use the imported GIF
    },
    // Add more exercises as needed
  ];

  // State to track which exercise is selected and its completion status
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(null);
  const [completedExercises, setCompletedExercises] = useState(Array(exercises.length).fill(false));

  const handleExerciseClick = (index) => {
    setSelectedExerciseIndex(selectedExerciseIndex === index ? null : index);
  };

  const handleCompleteClick = (index) => {
    const newCompletedExercises = [...completedExercises];
    newCompletedExercises[index] = true; // Mark this exercise as completed
    setCompletedExercises(newCompletedExercises);
  };

  return (
    <div className="energetic-exercise-container">
      
      <p>Follow along with these exercises designed for your comfort and well-being.</p>
      <div className="exercise-list">
        {exercises.map((exercise, index) => (
          <div key={index} className="exercise-card">
            <div onClick={() => handleExerciseClick(index)} className={`exercise-section ${completedExercises[index] ? 'completed' : ''}`}>
              <h3>{exercise.title}</h3>
              <p>{exercise.description}</p>
              {selectedExerciseIndex === index ? (
                <div className="exercise-gif-container">
                  <img src={exercise.gifSrc} alt={exercise.title} className="exercise-gif" />
                  {!completedExercises[index] && (
                    <button onClick={() => handleCompleteClick(index)} className="complete-button">Complete</button>
                  )}
                </div>
              ) : (
                <img src={exercise.titleImage} alt={exercise.title} className="exercise-title-image" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergeticExercise;
