import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHome,
  faCalendar,
  faHeartbeat,
  faUser,
  faPhotoVideo
} from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
import waving from './assets/waving.png';



const ProfilePage = () => {
  const navigate = useNavigate();

  // State variables for profile fields
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [number, setNumber] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);
  const [birthday, setBirthday] = useState(''); // For birthday
  const [badge, setBadge] = useState(false); // For profile achievement badge

  // Fetch username when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:3001/dashboard', { withCredentials: true })
      .then(res => {
        if (res.data.message === 'Success') {
          setUsername(res.data.username); // Set username from response
        } else {
          navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [navigate]);

  // Load data from local storage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('profileData'));
    if (storedData) {
      setUsername(storedData.username || ''); // Set stored username
      setCity(storedData.city || '');
      setCountry(storedData.country || '');
      setNumber(storedData.number || '');
      setBio(storedData.bio || '');
      setPhoto(storedData.photo || null);
      setBirthday(storedData.birthday || ''); // Load birthday
    }
  }, []);

  // Save data to local storage whenever profile data changes
  useEffect(() => {
    if (city || country || number || bio || photo || birthday) { // Ensure there's data before saving
      localStorage.setItem(
        'profileData',
        JSON.stringify({ username, city, country, number, bio, photo, birthday })
      );
    }
  }, [city, country, number, bio, photo, birthday]);

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // Reset profile data
  const handleReset = () => {
    setUsername('');
    setCity('');
    setCountry('');
    setNumber('');
    setBio('');
    setPhoto(null);
    setBirthday('');
    setBadge(false); // Reset badge state
    localStorage.removeItem('profileData'); // Clear localStorage only on reset
  

    // Navigate to the login page after resetting the profile
    navigate('/login');
  };

  // Handle birthday input
  const handleBirthdayChange = (e) => {
    setBirthday(e.target.value);
  };

  // Calculate the time to the next birthday
  const calculateBirthdayCountdown = () => {
    if (birthday) {
      const birthdayDate = new Date(birthday);
      const today = new Date();
      birthdayDate.setFullYear(today.getFullYear());
      if (today > birthdayDate) {
        birthdayDate.setFullYear(today.getFullYear() + 1);
      }
      const timeDifference = birthdayDate - today;
      const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return daysRemaining;
    }
    return null;
  };

  // Check for profile badge completion (e.g., 100% profile completion)
  useEffect(() => {
    if (username && city && country && number && bio && photo) {
      setBadge(true);
    } else {
      setBadge(false);
    }
  }, [username, city, country, number, bio, photo]);

  // Handle back button
  const handleBackClick = () => {
    navigate('/dashboard');
  };

  // Get current time of day for personalized greeting
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };



  return (
    <div className="profile-container">
      <div className="profile-header">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-arrow"
          onClick={handleBackClick}
        />
        <h2>Profile</h2>
      </div>
      <div className="Bhumi">
        <h2>{getGreeting()}, {username || 'User'}!</h2>
        <img src={waving} alt="Waving Hand" className="wavings-hand-icon" />
      </div>

      {/* Birthday Countdown */}
      {birthday && (
        <div className="birthday-countdown">
          <h3>Your birthday is in {calculateBirthdayCountdown()} days!</h3>
        </div>
      )}

      {/* Profile Achievement Badge */}
      {badge && (
        <div className="achievement-badge">
          <h3>🎉 Congrats! Your profile is 100% complete!</h3>
        </div>
      )}

      <div className="profile-photos">
        {photo ? (
          <img src={photo} alt="Profile" />
        ) : (
          <label htmlFor="photo-upload">Upload Photo</label>
        )}
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>
      <div className="profiles-details">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="date"
          value={birthday}
          onChange={handleBirthdayChange}
          placeholder="Birthday"
        />
      </div>
      <button className="profile-reset-button" onClick={handleReset}>
        Reset Profile
      </button>
      <button className="profile-logout-button" onClick={handleReset}>
  Logout
</button>


      <footer className="footer">
        <button className="footer-btn">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faHeartbeat} />
        </button>
        <button className="footer-btn active-icon">
          <FontAwesomeIcon icon={faUser} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faPhotoVideo} />
        </button>
      </footer>
    </div>
  );
};

export default ProfilePage;
