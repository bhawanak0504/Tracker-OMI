import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AIChatbot.css';

const Chatbot = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [reaction, setReaction] = useState('');

    const questions = [
        {
            question: "Are you expecting a baby boy or girl?",
            options: [
                "💙 Expecting a baby boy",
                "💖 Expecting a baby girl",
            ],
        },
        {
            question: "Is this your first time being a mother?",
            options: [
                "👶 Yes, it's my first time!",
                "👩‍👧 No, I'm an experienced mom",
            ],
        },
        {
            question: "What are you most excited about in this journey?",
            options: [
                "🎉 Excited to meet my baby!",
                "❤️ Choosing a name!",
                "👶 Planning the nursery!",
            ],
        },
    ];

    useEffect(() => {
        const initLandbot = () => {
            if (typeof window.myLandbot === 'undefined') {
                const s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;

                s.addEventListener('load', function () {
                    window.myLandbot = new Landbot.Livechat({
                        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2673254-CYTSLKAZ4BJZA0VV/index.json', // Updated config URL
                    });
                });

                s.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';
                const x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }
        };

        initLandbot();
    }, []);

    const handleOptionClick = (option) => {
        setReaction(`You selected: ${option}`);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setCurrentQuestionIndex(0);
            setTimeout(() => setReaction(''), 3000);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="close-icon" onClick={() => navigate('/dashboard')}>
                ❌
            </div>
            <h1 className="chatbot-heading">🌟 Welcome to Our Maternity Chatbot! 🌟</h1>
            <p>We're here to help you with any questions or concerns.</p>
            <div className="chatbot-background">
                <div className="fun-questions">
                    <p>{questions[currentQuestionIndex].question}</p>
                    <ul className="options-list">
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <li key={index} onClick={() => handleOptionClick(option)} className="option">
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
                {reaction && <p className="reaction">{reaction}</p>}
                <p>Click on the options above to get started!</p>
            </div>
        </div>
    );
};

export default Chatbot;

