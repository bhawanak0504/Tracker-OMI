
import React, { useState, useEffect } from 'react'; // Import useEffect here
import { useNavigate } from 'react-router-dom';
import './DietPlanner.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faHome, 
  faCalendar, 
  faHeartbeat, 
  faUser, 
  faPhotoVideo, 
  faHeart, 
  faShoppingCart, 
  faMagnifyingGlass 
} from '@fortawesome/free-solid-svg-icons';
import Payment from './Payment3';
import foodImage1 from './assets/food1.jpg';
import foodImage2 from './assets/food2.jpg';
import foodImage3 from './assets/food3.jpg';
import foodImage4 from './assets/food4.jpg';
import foodImage5 from './assets/food5.jpg';
import foodImage6 from './assets/food6.jpg';
import foodImage7 from './assets/food7.jpg';
import foodImage8 from './assets/food8.jpg';
import foodImage9 from './assets/food9.jpg';


const DietPlanner = () => {
  const [selectedCategory, setSelectedCategory] = useState('Veg');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [likes, setLikes] = useState({});
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mealTracker, setMealTracker] = useState({});
  const [progressPercentage, setProgressPercentage] = useState(0);

  const dietData = [
    { id: 1, name: 'Veg Salad', servings: '2 Servings', price: 500, category: 'Veg', image: foodImage1 },
    { id: 2, name: 'Grilled Chicken', servings: '1 Serving', price: 700, category: 'Non-Veg', image: foodImage2 },
    { id: 3, name: 'Chocolate Cake', servings: '4 Servings', price: 300, category: 'Desserts', image: foodImage3 },
    { id: 4, name: 'Fruit Smoothie', servings: '2 Servings', price: 400, category: 'Veg', image:  foodImage4},
    { id: 5, name: 'Pasta Primavera', servings: '2 Servings', price: 600, category: 'Veg', image: foodImage5 },
    { id: 6, name: 'Chicken Tikka', servings: '1 Serving', price: 800, category: 'Non-Veg', image: foodImage6},
    { id: 7, name: 'Chocolate Mousse', servings: '3 Servings', price: 350, category: 'Desserts', image:  foodImage7},
    { id: 8, name: 'Caesar Salad', servings: '2 Servings', price: 450, category: 'Veg', image:  foodImage8},
    { id: 9, name: 'Fish and Chips', servings: '1 Serving', price: 750, category: 'Non-Veg', image: foodImage9},
  ];

  const filteredData = dietData.filter(
    (item) =>
      item.category === selectedCategory &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLikeClick = (id) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: (prevLikes[id] || 0) + 1
    }));
  };

  const handleOrderClick = (item) => {
    setOrderList((prevOrderList) => [...prevOrderList, item]);
    setTotalAmount((prevAmount) => prevAmount + item.price);
    setMealTracker((prevTracker) => ({
      ...prevTracker,
      [item.id]: { ...item, eaten: false },
    }));
  };

  const handleConfirmOrder = () => {
    if (orderList.length === 0) {
      alert('No items to confirm.');
      return;
    }
    setOrderConfirmed(true);
    alert('Thank you for your order. Proceeding to payment!');
    setOrderList([]);
  };

  // Load meal tracker data from local storage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('mealTrackerData'));
    const lastTrackedTime = localStorage.getItem('lastTrackedTime');

    if (savedData && lastTrackedTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - lastTrackedTime;

      // Check if 24 hours have passed (24 * 60 * 60 * 1000 ms)
     if (elapsedTime < 1 * 60 * 1000) {
        setMealTracker(savedData);
      } else {
        // Clear data if more than 24 hours have passed
        localStorage.removeItem('mealTrackerData');
        localStorage.removeItem('lastTrackedTime');
      }
    }
  }, []);

  const toggleMealEaten = (id) => {
    console.log("Before Update:", mealTracker);
    const updatedMeals = { 
      ...mealTracker, 
      [id]: { ...mealTracker[id], eaten: !mealTracker[id].eaten } 
    };
    setMealTracker(updatedMeals);
    console.log("After Update:", updatedMeals);
  
    // Save updated meals and current time to local storage
    localStorage.setItem('mealTrackerData', JSON.stringify(updatedMeals));
    localStorage.setItem('lastTrackedTime', new Date().getTime());
    updateProgress(updatedMeals);
  };
  


  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/dashboard');
  };
  

// Calculate progress percentage
const updateProgress = (meals) => {
  const totalMeals = Object.keys(meals).length;
  const eatenMeals = Object.values(meals).filter(meal => meal.eaten).length;
  console.log(`Total Meals: ${totalMeals}, Eaten Meals: ${eatenMeals}`); // Log for debugging
  setProgressPercentage((eatenMeals / totalMeals) * 100);
};


  

  return (
    <div className="diet-planner-container">
      <div className="diet-header">
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          className="back-arrow" 
          onClick={handleBackClick}  
        />
        <h2 className="centered-title">Diet Planner</h2>
      </div>

      <div className="diet-search-bar">
        <input
          type="text"
          placeholder="Search Healthy food"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-magnifying-glass" />
      </div>

      <div className="diet-category-filter">
        <button 
          onClick={() => setSelectedCategory('Veg')} 
          className={`veg ${selectedCategory === 'Veg' ? 'active' : ''}`}
        >
          Veg
        </button>
        <button 
          onClick={() => setSelectedCategory('Non-Veg')} 
          className={`non-veg ${selectedCategory === 'Non-Veg' ? 'active' : ''}`}
        >
          Non-Veg
        </button>
        <button 
          onClick={() => setSelectedCategory('Desserts')} 
          className={`desserts ${selectedCategory === 'Desserts' ? 'active' : ''}`}
        >
          Desserts
        </button>
      </div>

      <div className="diet-food-list">
        {filteredData.map((item) => (
          <div key={item.id} className="diet-food-item">
            <img src={item.image} alt={item.name} className="diet-food-image" />
            <div className="diet-food-details">
              <h4>{item.name}</h4>
              <p>{item.servings}</p>
              <div className="diet-actions">
                <button 
                  className="diet-like-btn" 
                  onClick={() => handleLikeClick(item.id)}
                >
                  <FontAwesomeIcon icon={faHeart} /> {likes[item.id] || 0} Likes
                </button>
                <button 
                  className="diet-order-btn" 
                  onClick={() => handleOrderClick(item)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <h3>Order List</h3>
        {orderList.length === 0 ? (
          <p>No items in the order</p>
        ) : (
          <ul>
            {orderList.map((orderItem, index) => (
              <li key={index}>
                {orderItem.name} - {orderItem.servings} - ${(orderItem.price / 100).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
        {orderList.length > 0 && (
          <div>
            <h4>Total Amount: ${(totalAmount / 100).toFixed(2)}</h4>
            <button className="confirm-order-btn" onClick={handleConfirmOrder}>
              Confirm Order
            </button>
          </div>
        )}
      </div>

      {orderConfirmed && totalAmount > 0 && (
        <Payment amount={totalAmount} />
      )}

      {orderConfirmed && (
        <div className="order-confirmation">
          <h3>Order Confirmed!</h3>
          <p>Thank you for your order. Your food will be delivered shortly!</p>
        </div>
      )}
 <div className="meal-tracker">
      <h3>Daily Meal Tracker</h3>
      <ul>
        {Object.values(mealTracker).map((meal) => (
          <li key={meal.id} className={meal.eaten ? 'eaten' : 'not-eaten'}>
            <label>
              <input
                type="checkbox"
                checked={meal.eaten}
                onChange={() => toggleMealEaten(meal.id)}
              />
              {meal.name} - {meal.servings} - ${(meal.price / 100).toFixed(2)}
              <span className="badge">{meal.eaten ? 'Eaten' : 'Not Eaten'}</span>
            </label>
          </li>
        ))}
      </ul>
      {Object.values(mealTracker).length > 0 && (
        <div className="progress-tracker">
          <h4>Progress: {progressPercentage.toFixed(2)}%</h4>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>




      {/* Footer */}
      <footer className="footer">
        <button className="footer-btn active-icon">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faHeartbeat} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faUser} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faPhotoVideo} />
        </button>
      </footer>
    </div>
  );
};

export default DietPlanner;
