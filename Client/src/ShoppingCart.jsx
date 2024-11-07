import React, { useState } from 'react';
import './ShoppingCart.css';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe

// Importing images from assets
import product1 from './assets/product1.jpg';
import product2 from './assets/product2.jpg';
import product3 from './assets/product3.jpg';
import category1 from './assets/category1.jpg';
import category2 from './assets/category2.jpg';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Add your Stripe public key here

const ShoppingCart = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [cartItems, setCartItems] = useState([]);
    const [isCheckout, setIsCheckout] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', cardNumber: '' });

    const categories = [
        { id: 1, name: 'Maternity Wear', image: category1 },
        { id: 2, name: 'Pain Relief', image: category2 },
        // Add more categories as needed
    ];

    const defaultImage = 'https://via.placeholder.com/150'; // Placeholder image

    const products = [
        {
            id: 1,
            name: 'Pregnancy Pillow',
            price: 50,
            category: 'Pain Relief',
            image: product1 || defaultImage, // Fallback
        },
        {
            id: 2,
            name: 'Maternity Dress',
            price: 40,
            category: 'Maternity Wear',
            image: product2 || defaultImage, // Fallback
        },
        {
            id: 3,
            name: 'Baby Diapers',
            price: 30,
            category: 'Baby Hugs',
            image: product3 || defaultImage, // Fallback
        },
    ];

    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category === selectedCategory)
        : products;

    const addToCart = (product) => {
        setCartItems((prevItems) => [...prevItems, product]);
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        // Here, you would typically handle creating a payment intent on your server.
        // After that, redirect to the payment page.
        navigate('/payment', { state: { cartItems, totalPrice } }); // Pass cart items and total price to the payment page

        // Reset the cart and checkout state
        setCartItems([]); 
        setIsCheckout(false); 
    };

    return (
        <div className="shopping-cart-container">
            <header className="shop-header">
                <h2>Shop</h2>
                <FaTimes size={24} className="close-icon" onClick={() => navigate('/dashboard')} /> {/* Navigate to Dashboard */}
            </header>

            <div className="shop-layout">
                <div className="sidebar">
                    {categories.map((category) => (
                        <div key={category.id} className="category-item">
                            <img src={category.image} alt={category.name} />
                            <button
                                className="category-button"
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                {category.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="product-section">
                    <h3>Products</h3>
                    <div className="product-list">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} />
                                <h4>{product.name}</h4>
                                <p>Price: ${product.price}</p>
                                <button onClick={() => addToCart(product)}>
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cart-section">
                    <h3>Your Cart</h3>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty!</p>
                    ) : (
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <h4>{item.name}</h4>
                                    <p>Price: ${item.price}</p>
                                    <button onClick={() => removeFromCart(item.id)}>
                                        <FaTrash /> Remove
                                    </button>
                                </div>
                            ))}
                            <h4>Total: ${totalPrice}</h4>
                            {!isCheckout && (
                                <button onClick={() => setIsCheckout(true)} className="checkout-button">
                                    Proceed to Checkout
                                </button>
                            )}
                        </div>
                    )}

                    {isCheckout && (
                        <form className="checkout-form" onSubmit={handleOrderSubmit}>
                            <h3>Checkout</h3>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <div id="gpay-button" />
                            {/* Google Pay Button */}
                            <button type="submit" className="submit-button">Confirm Order</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;

