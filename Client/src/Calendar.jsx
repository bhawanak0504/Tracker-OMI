import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHome,
  faCalendar,
  faHeartbeat,
  faUser,
  faPhotoVideo
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import "./Calendar.css"; // Assuming custom styles for better presentation

const PregnancyCalculator = () => {
  const [method, setMethod] = useState("Last Period");
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [conceptionDate, setConceptionDate] = useState("");
  const [ultrasoundDate, setUltrasoundDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28); // Default cycle length
  const [dueDate, setDueDate] = useState(null);
  const [weeksPregnant, setWeeksPregnant] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [trimesterDates, setTrimesterDates] = useState({});
  const navigate = useNavigate();

  // Function to calculate the due date and other pregnancy details
  const calculateDueDate = () => {
    let calculatedDueDate;
    if (method === "Last Period" && lastPeriodDate) {
      const date = new Date(lastPeriodDate);
      date.setDate(date.getDate() + 280); // 280 days from LMP
      calculatedDueDate = date;
    } else if (method === "Conception Date" && conceptionDate) {
      const date = new Date(conceptionDate);
      date.setDate(date.getDate() + 266); // 266 days from conception
      calculatedDueDate = date;
    } else if (method === "Ultrasound Date" && ultrasoundDate) {
      const date = new Date(ultrasoundDate);
      date.setDate(date.getDate() + 280); // Adjust accordingly
      calculatedDueDate = date;
    }

    if (calculatedDueDate) {
      setDueDate(calculatedDueDate.toDateString());
      
      
      const today = new Date();
      const daysPregnant = Math.floor((today - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(daysPregnant / 7);
      const daysLeft = Math.floor((calculatedDueDate - today) / (1000 * 60 * 60 * 24));
      
      setWeeksPregnant(weeks);
      setDaysRemaining(daysLeft);

      // Set trimester dates
      const firstTrimesterEnd = new Date(new Date(lastPeriodDate).setDate(new Date(lastPeriodDate).getDate() + 91));
      const secondTrimesterEnd = new Date(new Date(lastPeriodDate).setDate(new Date(lastPeriodDate).getDate() + 182));
      setTrimesterDates({
        first: { start: new Date(lastPeriodDate).toDateString(), end: firstTrimesterEnd.toDateString() },
        second: { start: firstTrimesterEnd.toDateString(), end: secondTrimesterEnd.toDateString() },
        third: { start: secondTrimesterEnd.toDateString(), end: calculatedDueDate.toDateString() }
      });
    }
  };

  const resetCalculator = () => {
    setMethod("Last Period");
    setLastPeriodDate("");
    setConceptionDate("");
    setUltrasoundDate("");
    setCycleLength(28);
    setDueDate(null);
    setWeeksPregnant(0);
    setDaysRemaining(0);
    setTrimesterDates({});
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-arrow"
          onClick={handleBackClick}
        />
        <h2>Pregnancy Due Date Calculator</h2>
      </div>

      <div className="he"><p>Use this calculator to estimate your due date based on your last menstrual period, conception date, or an ultrasound.</p>
      </div>
      <div className="form-section">
        <label>Calculation Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="dropdown"
        >
          <option value="Last Period">Last Period</option>
          <option value="Conception Date">Conception Date</option>
          <option value="Ultrasound Date">Ultrasound Date</option>
        </select>

        {method === "Last Period" && (
          <>
            <label>The first day of your last period</label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
            />
            <label>Cycle Length</label>
            <select
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="dropdown"
            >
              {[...Array(15).keys()].map(i => (
                <option key={i} value={21 + i}>
                  {21 + i} days
                </option>
              ))}
            </select>
          </>
        )}

        {method === "Conception Date" && (
          <>
            <label>Date of Conception</label>
            <input
              type="date"
              value={conceptionDate}
              onChange={(e) => setConceptionDate(e.target.value)}
            />
          </>
        )}

        {method === "Ultrasound Date" && (
          <>
            <label>Date of Ultrasound</label>
            <input
              type="date"
              value={ultrasoundDate}
              onChange={(e) => setUltrasoundDate(e.target.value)}
            />
          </>
        )}

        <button onClick={calculateDueDate} className="calculate-btn">
          Calculate My Due Date
        </button>
      </div>

      {dueDate && (
        <div className="result">
         <div className="ptt"><h3>🎉 Congratulations! 🎉</h3></div> 
          <p>Your estimated due date is: <strong>{dueDate}</strong></p>
          <p>You are approximately <strong>{-weeksPregnant} weeks</strong> pregnant with <strong>{daysRemaining} days</strong> to go.</p>
          
          <div className="timeline">
           <div className="pt"><h4>Your Pregnancy Timeline</h4></div> 
            <div className="trimester">
              <div className="timeline-bar">
                <div className="trimester-section first-trimester"></div>
                <div className="trimester-section second-trimester"></div>
                <div className="trimester-section third-trimester"></div>
              </div>
              <div className="trimester-labels">
                <div>
                 <div className="pttt"><h5>1st Trimester</h5></div> 
                 <div className="pag"><p>{trimesterDates.first.start} - {trimesterDates.first.end}</p></div> 
                </div>
                <div>
                  <h5>2nd Trimester</h5>
                <div className="pag"><p>{trimesterDates.second.start} - {trimesterDates.second.end}</p></div>  
                </div>
                <div>
                  <h5>3rd Trimester</h5>
                 <div className="pag"> <p>{trimesterDates.third.start} - {trimesterDates.third.end}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={resetCalculator} className="preset-btn">
        Reset
      </button>

      <footer className="footer">
        <button className="footer-btn "><FontAwesomeIcon icon={faHome} /></button>
        <button className="footer-btn active-icon"><FontAwesomeIcon icon={faCalendar} /></button>
        <button className="footer-btn"><FontAwesomeIcon icon={faHeartbeat} /></button>
        <button className="footer-btn"><FontAwesomeIcon icon={faUser} /></button>
        <button className="footer-btn"><FontAwesomeIcon icon={faPhotoVideo} /></button>
      </footer>
    </div>
  );
};

export default PregnancyCalculator;
