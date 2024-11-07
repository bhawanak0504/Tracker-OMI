import React, { useState, useEffect } from 'react';
import './DVisualization.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faCalendar, faHeartbeat, faUser, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import TrimesterInfo from './TrimesterInfo';

const Visualization = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeline, setTimeline] = useState(Array(40).fill(null));
    const [showTimeline, setShowTimeline] = useState(false);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const navigate = useNavigate();

    const questions = [
        { question: "Which month are you in?", key: "inputMonth", type: "number", min: 1, max: 9 },
        { question: "Current week of your pregnancy:", key: "inputWeek", type: "number", min: 1, max: 40 }
    ];

    const handleBackClick = () => {
        navigate('/dashboard');
    };

    const handleSubmit = () => {
        const currentKey = questions[currentQuestionIndex].key;
        if (answers[currentKey]) {
            const weekIndex = answers.inputWeek - 1;
            const month = answers.inputMonth;

            const newTimeline = [...timeline];
            newTimeline[weekIndex] = month;

            if (weekIndex % 4 === 0 && weekIndex < 40) {
                const monthIndex = weekIndex / 4;
                newTimeline[monthIndex] = `Month ${month} Completed`;
            }

            setTimeline(newTimeline);
            setCurrentWeekIndex(weekIndex);
            localStorage.setItem('timelineData', JSON.stringify(newTimeline));
            localStorage.setItem('currentWeekIndex', weekIndex);
            localStorage.setItem('answers', JSON.stringify(answers));
            localStorage.setItem('lastInteraction', Date.now());

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            } else {
                setShowTimeline(true);
            }
        } else {
            alert('Please fill in the answer.');
        }
    };

    const handleChange = (e) => {
        setAnswers({
            ...answers,
            [questions[currentQuestionIndex].key]: e.target.value
        });
    };

    const handleReset = () => {
        setAnswers({});
        setTimeline(Array(40).fill(null));
        setCurrentQuestionIndex(0);
        setShowTimeline(false);
        setCurrentWeekIndex(0);
        localStorage.removeItem('timelineData');
        localStorage.removeItem('currentWeekIndex');
        localStorage.removeItem('answers');
        localStorage.removeItem('lastInteraction');
    };

    useEffect(() => {
        const savedAnswers = JSON.parse(localStorage.getItem('answers'));
        const savedTimeline = JSON.parse(localStorage.getItem('timelineData'));
        const savedWeekIndex = localStorage.getItem('currentWeekIndex');
        const lastInteraction = localStorage.getItem('lastInteraction');

        if (savedAnswers) {
            setAnswers(savedAnswers);
            const inputWeek = savedAnswers.inputWeek ? parseInt(savedAnswers.inputWeek) : null;
            const inputMonth = savedAnswers.inputMonth ? parseInt(savedAnswers.inputMonth) : null;

            if (inputWeek && inputMonth) {
                setShowTimeline(true);
                setTimeline(savedTimeline);
                setCurrentWeekIndex(savedWeekIndex ? parseInt(savedWeekIndex) : inputWeek - 1);
                
                if (lastInteraction) {
                    const elapsed = Math.floor((Date.now() - parseInt(lastInteraction)) / (1000 * 60 * 60 * 24));
                    const newIndex = Math.min(39, (parseInt(savedWeekIndex) + elapsed));
                    setCurrentWeekIndex(newIndex);
                }
            }
        }
    }, []);

    useEffect(() => {
        let interval;
        if (showTimeline) {
            interval = setInterval(() => {
                setCurrentWeekIndex(prev => {
                    const nextWeek = prev < 39 ? prev + 1 : prev;
                    localStorage.setItem('currentWeekIndex', nextWeek);
                    localStorage.setItem('lastInteraction', Date.now());
                    return nextWeek;
                });
            }, 1000 );
        }
        return () => {
            clearInterval(interval);
        };
    }, [showTimeline]);

    // Function to get the current trimester
    const getTrimester = (currentWeek) => {
        if (currentWeek < 13) {
            return "First Trimester";
        } else if (currentWeek < 28) {
            return "Second Trimester";
        } else {
            return "Third Trimester";
        }
    };

    return (
        <div className="v-container">
            <div className="v-header">
                <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" onClick={handleBackClick} />
                <h2 className="centered-title">3D-Visualization</h2>
            </div>

            {!showTimeline ? (
                <div className="promptv-box">
                    {currentQuestionIndex < questions.length ? (
                        <>
                            <h3>{questions[currentQuestionIndex].question}</h3>
                            <div className="inputv-group">
                                <input
                                    type={questions[currentQuestionIndex].type}
                                    value={answers[questions[currentQuestionIndex].key] || ''}
                                    onChange={handleChange}
                                    min={questions[currentQuestionIndex].min}
                                    max={questions[currentQuestionIndex].max}
                                    placeholder={`Enter ${questions[currentQuestionIndex].question}`}
                                />
                            </div>
                            <button onClick={handleSubmit} className="submitv-button">Next</button>
                        </>
                    ) : (
                        <div>
                            <h3>Thank you for your input!</h3>
                        </div>
                    )}
                </div>
            ) : (
                <div className="timeline">
                    <h4>Your Timeline:</h4>
                    {timeline.map((month, index) => (
                        <div
                            key={index}
                            className={`week-circle ${index <= currentWeekIndex ? 'active' : ''}`}
                            title={`Week ${index + 1}: ${month || 'Not answered'}`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            )}

            {showTimeline && (
                <TrimesterInfo 
                    month={answers.inputMonth} 
                    week={currentWeekIndex + 1} 
                    trimester={getTrimester(currentWeekIndex)} // Pass the trimester based on current week index
                />
            )}

           <div className="resets"><button onClick={handleReset} >Reset</button></div>

            <footer className="footer">
                <button className="footer-btn active-icon"><FontAwesomeIcon icon={faHome} /></button>
                <button className="footer-btn"><FontAwesomeIcon icon={faCalendar} /></button>
                <button className="footer-btn"><FontAwesomeIcon icon={faHeartbeat} /></button>
                <button className="footer-btn"><FontAwesomeIcon icon={faUser} /></button>
                <button className="footer-btn"><FontAwesomeIcon icon={faPhotoVideo} /></button>
            </footer>
        </div>
    );
};

export default Visualization;

