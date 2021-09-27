import React, { useState, useEffect } from 'react';
import './App.css';

const StarsDisplay = props => (
  <>
    {utils.range(1, props.stars).map(starId => (
      <div key={starId} className='star' />
    ))}
  </>
);

const PlayNumber = props => {
  return (
    <button 
      className='number'
      style={{ backgroundColor: colors[props.status] }}
      onClick={() => props.onClick(props.number, props.status)}>
      {props.number}
    </button>
  );
}

const PlayAgain = props => (
  <div className="game-done">
    <div 
    className="message"
    style={{ color: props.gameStatus === 'lost' ? "red" : "green"}}
    >
      {props.gameStatus === 'lost' ? 'Game Over!' : 'Winner!'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

// A custom hook to handle state in a "stateful" function; start it with the word use to match hook nomenclature.
// The rule of hook: it can't be subject to conditionals.
const useGameState = () => {
  // Initialize the state.
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  // The timer.
  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [secondsLeft, availableNums]);

  // Update the state.
  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) !== stars) setCandidateNums(newCandidateNums);
    else {
      const newAvailableNums = availableNums.filter(num => !newCandidateNums.includes(num));
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }
  return { stars, availableNums, candidateNums, secondsLeft, setGameState }
}


const Game = (props) => {
  // const [stars, setStars] = useState(utils.random(1, 9));
  // const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  // const [candidateNums, setCandidateNums] = useState([]);
  // const [secondsLeft, setSecondsLeft] = useState(10);

  // // The timer.
  // useEffect(() => {
  //   if (secondsLeft > 0 && availableNums.length > 0) {
  //     const timerId = setTimeout(() => {
  //       setSecondsLeft(secondsLeft - 1);
  //     }, 1000);
  //     return () => clearTimeout(timerId);
  //   }
  // }, [secondsLeft, availableNums]);

  const { 
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();

  const candidatesWrong = utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0
    ? 'won' 
    : secondsLeft === 0
    ? 'lost' 
    : 'active';

  // Reset state => now doing it by unmounting and remounting the game in the StarMatch component by assigning a new id to the key attribute.
  // const resetGame = () => {
  //   setStars(utils.random(1, 9));
  //   setAvailableNums(utils.range(1, 9));
  //   setCandidateNums([]);
  //   setSecondsLeft(10);
  // }

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) return 'used';
    if (candidateNums.includes(number)) 
      return candidatesWrong ? 'wrong' : 'candidate';
    return 'available';
  }

  const onNumberClick = (number, status) => {
    if (gameStatus !== 'active' || status === 'used') return;
    
    const newCandidateNums = 
      status === 'available' 
        ? candidateNums.concat(number) 
        : candidateNums.filter(wrongNum => wrongNum !== number);
      ;
    // if (utils.sum(newCandidateNums) !== stars) setCandidateNums(newCandidateNums);
    // else {
    //   const newAvailableNums = availableNums.filter(num => !newCandidateNums.includes(num));
    //   setStars(utils.randomSumIn(newAvailableNums, 9));
    //   setAvailableNums(newAvailableNums);
    //   setCandidateNums([]);
    // }
    setGameState(newCandidateNums);
    
  }
  return (
    <div className="game">
      <div className="help">
        Pick one or more numbers that in sum equal the number of stars shown.
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
          ) : 
            <StarsDisplay stars={stars} />
          }
        </div>
        <div className="right">
          {utils.range(1, 9).map(num => (
            <PlayNumber 
              key={num} 
              number={num} 
              status={numberStatus(num)}
              onClick={onNumberClick}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />
}

// The color theme.
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// The math.
const utils = {
  // Sum an array.
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // Create an array of numbers between min and max (edges included).
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // Pick a random number between min and max (edges included).
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max, pick a random sum (< max) from the set of all available sums in arr.
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;
