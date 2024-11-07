import React, { useState } from 'react';
import './Cashless.css'; // Importing CSS

const Cashless = () => {
    const [name, setName] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');
    const [isEligible, setIsEligible] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const handleCheckEligibility = (e) => {
        e.preventDefault();

        // Simple eligibility check logic
        if (name && policyNumber) {
            // Assuming eligibility logic is correct
            setIsEligible(true);
            // Redirect to payment page
            redirectToPayment(policyNumber);
        } else {
            setIsEligible(false);
        }
    };

    const redirectToPayment = (policyNumber) => {
        // Construct your payment URL, including the policy number
        window.location.href = `/payment?policyNumber=${policyNumber}`;
    };

    const openModal = () => {
        setShowModal(true);
    };

    // Function to handle modal closing
    const closeModal = () => {
        setShowModal(false);
        // Reset state when closing modal
        setName('');
        setPolicyNumber('');
        setIsEligible(null);
    };

    return (
        <div className="cashless-facility">
            <button className="cash" onClick={openModal}>
                Cashless Facility
            </button>

            {showModal && (
                <div className="cash-model">
                    <div className="cash-content">
                       <div className="ca"><h3>Cashless Maternity Insurance Facility</h3></div> 
                        <form onSubmit={handleCheckEligibility}>
                            <div className="cash-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="cash-group">
                                <label htmlFor="policyNumber">Policy Number:</label>
                                <input
                                    type="text"
                                    id="policyNumber"
                                    value={policyNumber}
                                    onChange={(e) => setPolicyNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">Check Eligibility</button>
                        </form>
                        {isEligible !== null && (
                            <div className={`eligibility-result ${isEligible ? 'eligible' : 'not-eligible'}`}>
                                {isEligible ? "You are eligible for cashless maternity insurance!" : "You are not eligible. Please check your details."}
                            </div>
                        )}
                        <button onClick={closeModal} className="closei-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cashless;
