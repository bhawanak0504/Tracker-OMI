import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './VirtualConsultation.css'; // Assuming this file contains your styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import doctor1 from './assets/doctor1.jpg';
import doctor2 from './assets/doctor2.jpg';
import doctor3 from './assets/doctor3.jpg';


import {  
  faHome, 
  faHeartbeat, 
  faUser, 
  faCalendar, 
  faPhotoVideo,
  faArrowLeft,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3002'); // Your backend server address

const doctors = [
  {
    name: 'Dr. Karan',
    email: 'bhumijain127@gmail.com',
    specialization: 'Gynecology',
    experience: '10 years',
    profilePicture: doctor1, // Replace with actual image URL
  },
  {
    name: 'Dr. Liza',
    email: 'bhawanak768@gmail.com',
    specialization: 'Gynecology',
    experience: '15 years',
    profilePicture: doctor2, // Replace with actual image URL
  },
  {
    name: 'Dr. sharma',
    email: 'btslovebtslove540@gmail.com',
    specialization: 'Gynecology',
    experience: '8 years',
    profilePicture: doctor3, // Replace with actual image URL
  }
];

const VirtualConsultation = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [message, setMessage] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (messageData) => {
      setChatMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    const messageData = {
      user: userName,
      doctor: selectedDoctor.name,
      message: newMessage,
    };

    // Emit the message to the server
    socket.emit('sendMessage', messageData);
    setNewMessage(''); // Clear message input after sending
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate generating a meeting link
    const generatedLink = `https://meeting-platform.com/join?meetingId=${Math.random().toString(36).substring(7)}`;
    setMeetingLink(generatedLink);

    // Call API to send email to the doctor
    sendEmailToDoctor(
      selectedDoctor.email,
      userName,
      userEmail,
      appointmentDate,
      appointmentTime,
      generatedLink
    );

  setMessage(`Appointment scheduled successfully with ${selectedDoctor.name}! Meeting link: ${generatedLink}`);

    // Clear form after submission
    setUserName('');
    setUserEmail('');
    setAppointmentDate('');
    setAppointmentTime('');
    setSelectedDoctor(null);
  };

  // Simulated email sending function
  const sendEmailToDoctor = async (doctorEmail, userName, userEmail, appointmentDate, appointmentTime, meetingLink) => {
    try {
      const response = await fetch('http://localhost:3001/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          userEmail,
          doctorEmail,
          appointmentDate,
          appointmentTime,
          meetingLink,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startChat = () => {
    setChatStarted(true);
  };

  // Add draggable functionality for the chatbox
  const dragElement = (element) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const mouseDownHandler = (e) => {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    const elementDrag = (e) => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    };

    const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    };

    element.onmousedown = mouseDownHandler;
};


useEffect(() => {
  console.log("Chat started:", chatStarted);
  if (chatBoxRef.current) {
    dragElement(chatBoxRef.current);
  }
}, [chatStarted, chatBoxRef]); // Make sure chatStarted is included
 // This runs only once when chatBoxRef is set


useEffect(() => {
  if (chatStarted && inputRef.current) {
    inputRef.current.focus(); // Focus on the input field
  }
}, [chatStarted]);

  const navigate = useNavigate();





  return (
    <div className="container-virtual">
      <div className="header-virtual">
        <h1>Virtual Consultation</h1>
        <div class="icon">
          <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate('/dashboard')} />
        </div>
      </div>

      <div className="select-doctor"><h2>Select a Doctor</h2></div>
      <ul className="doctor-list">
        {doctors.map((doctor, index) => (
          <li
            key={index}
            className={`doctor-item ${selectedDoctor?.name === doctor.name ? 'selected' : ''}`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <img src={doctor.profilePicture} alt={doctor.name} className="doctor-profile-pic" />
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
              <p>Experience: {doctor.experience}</p>
              <p>Email: {doctor.email}</p>
            </div>
          </li>
        ))}
      </ul>

      {selectedDoctor && (
        <form className="consultation-form" onSubmit={handleSubmit}>
          <h3>Schedule a meeting with {selectedDoctor.name}</h3>
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
          <button type="submit">Schedule Meeting</button>
          <button type="button" onClick={startChat}>Start Chat with {selectedDoctor.name}</button>
        </form>
      )}

 

      {chatStarted && (
        <div ref={chatBoxRef} className="chat-box" style={{ position: 'fixed', top: '100px', left: '50px', cursor: 'move' }}>
            <div className="chat-header">
          <h3>Chat with {selectedDoctor.name}</h3>
          <span className="cross-button" onClick={() => setChatStarted(false)}>
                <FontAwesomeIcon icon={faTimes} /> {/* Add a cross icon */}
            </span>
            </div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <p key={index}><strong>{msg.user}:</strong> {msg.message}</p>
            ))}
          </div>
          <input
  ref={inputRef}
  type="text"
  placeholder="Type your message..."
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
/>

          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}

      {message && <p className="success-message">{message}</p>}

      {/* Footer Section */}
      <footer className="footer-virtual">
        {/* Adding active class for home page */}
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

export default VirtualConsultation;
