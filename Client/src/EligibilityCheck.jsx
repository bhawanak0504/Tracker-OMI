import React, { useState } from 'react';
import './EligibilityCheck.css';

const EligibilityCheck = () => {
  const [age, setAge] = useState('');
  const [alreadyInsured, setAlreadyInsured] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal
  const [submitted, setSubmitted] = useState(false); // State to track submission

  // Function to handle eligibility check submission
  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    
    // Open modal when checking eligibility
    setShowModal(true); 

    const response = await fetch('http://localhost:3001/api/check-eligibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ age: Number(age), alreadyInsured }),
    });

    const data = await response.json();
    setEligibilityStatus(data.message);

    // Don't close the modal here; let it stay open until the user decides to close it
  };

  const closeModal = () => {
    setShowModal(false);
    setEligibilityStatus(''); // Clear eligibility status when modal is closed
  };

  return (
    <div className='eligible'>
      <button className="eligible-item" onClick={() => setShowModal(true)}>
        Eligibility Check
      </button>

      {/* Modal for eligibility check */}
      {showModal && (
        <div className="eligible-model">
          <div className="eligble-content">
           <div className="eligi"><h3>Check Eligibility for Maternity Insurance</h3></div> 
            <form onSubmit={handleCheckEligibility}>
              <div>
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            
              <button type="submit" className="check-button">Check Eligibility</button>
            </form>

            {/* Show eligibility status after form submission */}
            {eligibilityStatus && <p>Eligibility Status: {eligibilityStatus}</p>}
            <button onClick={closeModal} className="closess-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityCheck;