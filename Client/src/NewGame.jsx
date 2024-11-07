import React, { useState } from 'react';
import './NewGame.css'; // Import the colorful CSS
import contractionImage from './assets/contraction.png'; // Example image
import ultrasoundImage from './assets/ultrasound.png'; // Example image
import placentaImage from './assets/placenta.png'; // Example image
import epiduralImage from './assets/epidural.png'; // Example image
import newbornImage from './assets/newborn.png'; // Example image

const wordData = [
  { word: 'contraction', definition: 'The tightening of muscles in the uterus during labor.', image: contractionImage },
  { word: 'ultrasound', definition: 'A scan used to create an image of a baby in the womb.', image: ultrasoundImage },
  { word: 'placenta', definition: 'An organ that develops in the uterus during pregnancy.', image: placentaImage },
  { word: 'epidural', definition: 'A common method of pain relief during labor.', image: epiduralImage },
  { word: 'newborn', definition: 'A baby that is only a few days or weeks old.', image: newbornImage },
];

const scrambleWord = (word) => {
  const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
  return scrambled;
};

const NewGame = () => {
  const [scrambledWords, setScrambledWords] = useState(wordData.map(data => ({ ...data, scrambled: scrambleWord(data.word) })));
  const [input, setInput] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [hints, setHints] = useState(Array(scrambledWords.length).fill(false)); // To track hints for each word

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundWord = scrambledWords.find(word => word.word === input.toLowerCase());
    if (foundWord && !foundWords.includes(foundWord.word)) {
      setFoundWords([...foundWords, foundWord.word]);
      setInput(''); // Reset input field
    }
  };

  const handleHint = (index) => {
    const updatedHints = [...hints];
    updatedHints[index] = true; // Show hint for this word
    setHints(updatedHints);
  };

  return (
    <div className="new-game-container">
      <h2>Word Scramble Game</h2>
      <div className="word-list">
        {scrambledWords.map((wordObj, index) => (
          <div key={index} className={`word ${foundWords.includes(wordObj.word) ? 'found' : ''}`}>
            {wordObj.scrambled}
            {!foundWords.includes(wordObj.word) && (
              <button onClick={() => handleHint(index)} className="hint-button">Need a Hint?</button>
            )}
            {hints[index] && (
              <div className="hint">Hint: {wordObj.definition}</div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Unscramble the word"
          required
        />
        <button type="submit"><div className="sumit">Submit</div></button>
      </form>
      <div className="found-words">
        <h3>Found Words:</h3>
        {foundWords.map((word, index) => {
          const wordObj = wordData.find(obj => obj.word === word);
          return (
            <div key={index} className="found-word">
              <span>{word}</span>
              <img src={wordObj.image} alt={wordObj.word} className="found-image" />
              <p className="definition">{wordObj.definition}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewGame;
