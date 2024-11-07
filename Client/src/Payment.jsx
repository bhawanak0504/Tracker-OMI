import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom'; // Import useLocation
import './Payment.css'; // Import the CSS file

const stripePromise = loadStripe('pk_test_51QBYZfKdN6zW91jAHl8jmoJXTEHOUHgpUqGYZ8MfZaJDdGAZNr0W2CsPIjGpS4dvURexR5z4LCLvY2WzGC2BzHkw00uqEZYDsi'); // Add your Stripe public key here

const Payment = () => {
    const location = useLocation();
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 }; // Get cart items and total price
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Reset message

        const stripe = await stripePromise;

        // Call your backend to create a Checkout session
        const response = await fetch('http://localhost:3001/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalPrice * 100 }), // Send amount in cents
        });

        if (!response.ok) {
            setMessage('Failed to create checkout session. Please try again.');
            console.error('Failed to create checkout session');
            setLoading(false);
            return;
        }

        const session = await response.json();

        // Redirect to Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            setMessage(result.error.message);
            console.error(result.error.message);
            setLoading(false);
        } else {
            setMessage('Payment successful! Redirecting...');
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment</h2>
            {message && <div className="payment-alert">{message}</div>}
            <h3>Your Order:</h3>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        {item.name} - ${item.price}
                    </li>
                ))}
            </ul>
            <h4>Total: ${totalPrice}</h4>
            <form onSubmit={handlePayment} className="payment-form">
                <button type="submit" disabled={loading} className="payment-button">
                    {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`} {/* Corrected interpolation */}
                </button>
            </form>
        </div>
    );
};

export default Payment;
