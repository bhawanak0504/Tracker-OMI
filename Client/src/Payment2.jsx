import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QBYZfKdN6zW91jAHl8jmoJXTEHOUHgpUqGYZ8MfZaJDdGAZNr0W2CsPIjGpS4dvURexR5z4LCLvY2WzGC2BzHkw00uqEZYDsi'); // Replace with your public Stripe key

const Payment = () => {
    const policyNumber = new URLSearchParams(window.location.search).get('policyNumber');

    const handlePayment = async () => {
        const stripe = await stripePromise;

        // Call your backend to create a Payment Intent and get the client secret
        const response = await fetch('http://localhost:3001/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ policyNumber }), // Send policy number to backend
        });

        const data = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: data.id,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment for Policy Number: {policyNumber}</h2>
            <button onClick={handlePayment}>Proceed to Payment</button>
        </div>
    );
};

export default Payment;
