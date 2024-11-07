import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QBYZfKdN6zW91jAHl8jmoJXTEHOUHgpUqGYZ8MfZaJDdGAZNr0W2CsPIjGpS4dvURexR5z4LCLvY2WzGC2BzHkw00uqEZYDsi');

const Payment = ({ amount }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        const stripe = await stripePromise;

        // Call your backend to create a Checkout session
        const response = await fetch('http://localhost:3001/api/creates-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }), // Send the amount correctly
        });

        if (!response.ok) {
            setMessage('Failed to create checkout session. Please try again.');
            setLoading(false);
            return;
        }

        const { sessionId } = await response.json();

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
            console.error('Error redirecting to checkout:', error);
            setMessage('Error redirecting to checkout. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="payment-container">
            <h2>Payment</h2>
            {message && <div className="payment-alert">{message}</div>}
            <form onSubmit={handlePayment} className="payment-form">
                <button type="submit" disabled={loading} className="payment-button">
                    {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
                </button>
            </form>
        </div>
    );
};

export default Payment;
