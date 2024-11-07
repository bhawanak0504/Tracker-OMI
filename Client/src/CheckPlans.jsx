import React, { useState } from 'react';
import './CheckPlans.css';

const CheckPlans = () => {
  const [plans] = useState([
    {
      id: 1,
      name: 'Basic Maternity Plan',
      coverage: 'Covers maternity expenses up to $10,000',
      premium: '$200/month',
      description: 'This plan covers essential maternity expenses including hospital stays and doctor visits.',
      PolicyNumber:'1001',
    },
    {
      id: 2,
      name: 'Standard Maternity Plan',
      coverage: 'Covers maternity expenses up to $15,000',
      premium: '$300/month',
      description: 'Includes additional benefits like prenatal checkups and vaccinations.',
      PolicyNumber:'1002',
    },
    {
      id: 3,
      name: 'Premium Maternity Plan',
      coverage: 'Covers maternity expenses up to $25,000',
      premium: '$500/month',
      description: 'Comprehensive coverage including home delivery, maternity classes, and postpartum care.',
      PolicyNumber:'1003',
    },
  ]);

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const closeModal = () => {
    setShowModal(false); // Close modal
  };

  const handleCheckPlans = () => {
    setShowModal(true); // Show modal when checking plans
  };

  return (
    <div className="maternity-insurance-plans">
      <button className="check" onClick={handleCheckPlans}>
        Check Plans
      </button>

      {showModal && (
        <div className="check-model">
          <div className="check-content">
           <div className="avai"><h3>Available Maternity Plans</h3></div> 
            <ul className="check-list">
              {plans.map((plan) => (
                <li key={plan.id} className="check-item">
                  <h3>{plan.name}</h3>
                  <p><strong>Coverage:</strong> {plan.coverage}</p>
                  <p><strong>Premium:</strong> {plan.premium}</p>
                  <p>{plan.description}</p>
                  <p><strong>Policy-No.</strong>{plan.PolicyNumber}</p>
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="closesss-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckPlans;
