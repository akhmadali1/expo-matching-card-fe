import { useState, useEffect, useRef } from 'react';
import Count from '@/components/counting';
import styles from '@/styles/MatchingGame.module.css'
import useScore from './api/score';
import { Encrypt } from '@/lib/crypto';
const cardList = [
  'sakatonik',
  'double',
  'fairy',
  'fighting',
  'fire',
  'grass',
  'lightning',
  'metal',
  'psychic',
  'water'
];

const cardListMedium = [
  'sakatonik',
  'sakatonik-1',
  'fairy',
  'fighting',
  'fire',
  'grass',
  'lightning',
  'metal',
  'psychic',
  'water'
];
const cardListHard = [
  'sakatonik',
  'sakatonik-1',
  'sakatonik-2',
  'fighting',
  'fire',
  'grass',
  'lightning',
  'metal',
  'psychic',
  'water'
];

const rows = 4;
const columns = 5;

const generateInitialBoard = (difficulty) => {
  let cardListDifficulty = [];
  if (difficulty === 1){
   cardListDifficulty = cardList;
  }else if (difficulty === 2){
    cardListDifficulty = cardListMedium;
  }else if (difficulty === 3){
    cardListDifficulty = cardListHard;
  }
  const cards = cardListDifficulty.concat(cardListDifficulty);
  const shuffledCards = cards.sort(() => Math.random() - 0.5);
  const initialBoard = [];

  let cardIndex = 0;
  const totalCards = rows * columns;
  // const decoyCount = totalCards - difficulty;

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      let card = shuffledCards[cardIndex];

      // Adding decoy cards based on the difficulty level
      // if (card.startsWith('darkness') && card !== 'darkness' && decoyCount > 0) {
      //   card = 'darkness'; // Replace with the primary card for decoys
      //   decoyCount--;
      // }

      row.push({
        id: `${i}-${j}`,
        card,
        flipped: false,
        matched: false,
        clickable: true
      });
      cardIndex++;
    }
    initialBoard.push(row);
  }
  return initialBoard;
};

export default function MatchingCardGame() {
  const [board, setBoard] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState(0);
  const [errors, setErrors] = useState(0);
  const [clickPlay, setClickPlay] = useState(0);

  const [gameStart, setGameStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const textCommand = ["Ready", "Set", "Go"]
  const [text, setText] = useState("");

  const { GetScoreAPI, PostScoreAPI } = useScore();
  const [dataScoreBoard, setDataScoreBoard] = useState([]);

  const fetchDataScoreBoard = async () => {
    const dataFromAPI = await GetScoreAPI();
    console.log("data", dataFromAPI)
    if (dataFromAPI.data) {
      setDataScoreBoard(dataFromAPI.data)
    } else {
      setDataScoreBoard([])
    }
  }

  useEffect(() => {
    fetchDataScoreBoard();
  }, [])

  const resetGame = () => {
    setSelectedCards([]);
    setMatchedCards(0);
    setErrors(0);
    setClickPlay(0);
    setDifficulty(1);
    setUsername("");
    resetStopwatch();
  };

  const flipCard = (row, col) => {
    if (selectedCards.length === 2 || !board[row][col].clickable) {
      return;
    }

    const updatedBoard = [...board];
    updatedBoard[row][col].flipped = true;
    updatedBoard[row][col].clickable = false;
    setSelectedCards([...selectedCards, updatedBoard[row][col]]);
    setBoard(updatedBoard);
  };

  const checkForMatch = () => {
    const [card1, card2] = selectedCards;
    const updatedBoard = board.map(row =>
      row.map(col => {
        if (col.id === card1.id || col.id === card2.id) {
          return { ...col, flipped: false, clickable: true };
        }
        return col;
      })
    );

    if (card1.card === card2.card) {
      updatedBoard[parseInt(card1.id.split('-')[0])][parseInt(card1.id.split('-')[1])].matched = true;
      updatedBoard[parseInt(card2.id.split('-')[0])][parseInt(card2.id.split('-')[1])].matched = true;
      setBoard(updatedBoard);
      setMatchedCards(matchedCards + 2);
    } else {
      setBoard(updatedBoard);
      setErrors(errors + 1);
    }
    setSelectedCards([]);
  };

  const [time, setTime] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });
  const [timeCount, setTimeCount] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return (
      <>
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}:
        {milliseconds < 10 ? `0${milliseconds}` : milliseconds}
      </>
    );
  };

  const startStopwatch = () => {
    const startTime = Date.now() - (time.minutes * 60000 + time.seconds * 1000 + time.milliseconds);
    intervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const minutes = Math.floor(elapsedTime / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      const milliseconds = Math.floor((elapsedTime % 1000) / 10);
      setTimeCount(elapsedTime);
      setTime({ minutes, seconds, milliseconds });
    }, 10);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTimeCount(0);
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      const timeout = setTimeout(() => {
        checkForMatch();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [selectedCards]);


  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  useEffect(() => {
    let intervalId;
    if (gameStart) {
      let i = 0;
      setLoading(true);
      setText(textCommand[0]);
      intervalId = setInterval(() => {
        setText(textCommand[i]);
        i++;
        if (i === textCommand.length + 1) {
          clearInterval(intervalId);
          setLoading(false);
          setGameStart(false);
          setClickPlay(2);
          setBoard(generateInitialBoard(difficulty));
          startStopwatch();
          i = 0;
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameStart]);

  const calculateScore = (difficulty, timeCount, errors) => {
    let score = 0;
  
    switch (difficulty) {
      case 1:
        score = timeCount * 1 - errors * 6 ;
        break;
      case 2:
        score = timeCount * 2 - errors * 5;
        break;
      case 3:
        score = timeCount * 4 - errors * 4;
        break;
      default:
        score = timeCount - errors;
        break;
    }
  
    return score > 0 ? score : 0; // Ensure score is non-negative
  };
  
  useEffect(() => {
    const handleMatchedCards = async () => {
      if (matchedCards === rows * columns) {

        const score = calculateScore(difficulty, timeCount, errors)
        alert(`Congratulations! You've matched all the cards! Your score: ${score}`);
        const requestBody = {
          username,
          error: errors,
          time: timeCount,
          score: score,
          time_expired: Math.floor(new Date().getTime() / 1000),
        };

        const encryptedCredentials = Encrypt(JSON.stringify(requestBody));
        let formData = {
          credentials: encryptedCredentials,
        };

        try {
          const postAPI = await PostScoreAPI(formData);
          fetchDataScoreBoard();
          resetGame();
        } catch (error) {
          // Handle error from PostScoreAPI or any other error handling logic
          console.error('Error occurred while posting score:', error);
        }
      }
    };

    handleMatchedCards();
  }, [matchedCards]);


  return (
    <div>
      <style>
        {
          `
          ${clickPlay === 2 && `
          .tile {
          
            position: relative;
            transform-style: preserve-3d;
            transform-origin: center right;
            transition: all 0.5s;
          
            width: 75px;
            height: 75px;
          
            color: #fff;
            font-family: sans-serif;
            box-shadow: 0px 0px 25px -15px rgba(66, 68, 90, 1);
          }
          
          .tile:hover {
            transform: translateY(-5%);
            box-shadow: 0px 0px 40px -15px rgba(66, 68, 90, 1);
          }
          
          .tile__face {
            display: flex;
            justify-content: center;
            align-items: center;
          
            position: absolute;
            width: 100%;
            height: 100%;
          
            font-size: 12px;
          
            backface-visibility: hidden; /*hide element on back*/
          }
          
          .tile__face--back {
            transform: rotateY(180deg);
          }
          
          .tile.is-flipped {
            transform: translateX(-100%) rotateY(-180deg);
          }
          `}
          `
        }
      </style>
      <div style={clickPlay == 0 ? { textAlign: 'center' } : { display: 'none' }}>
        Scoreboard
        <div style={{ width: '100%', marginTop: '5px', overflowY: 'auto', overflowX: 'hidden', height: '40vh' }}>
          <table border="1" cellPadding="10" style={{ tableLayout: 'fixed', borderCollapse: 'collapse', margin: '0 auto', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Score</th>
                <th>Time</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {dataScoreBoard.map((item) => (
                <>
                  <tr>
                    <td>{item.Username}</td>
                    <td>{item.Score}</td>
                    <td>{formatTime(item.Time)}</td>
                    <td>{item.Error}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <h1>Welcome to Cards Match</h1>
        <button style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }} onClick={(e) => {
          e.preventDefault();
          setTime({ minutes: 0, seconds: 0, milliseconds: 0 });
          setClickPlay(1);
        }}>
          Play
        </button>
      </div>
      {clickPlay == 1 &&
        <>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (username !== "") {
              setGameStart(true);
            }
          }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <label for="fname">Username:</label><br />
            <input type="text" name="username" onChange={(e) => {
              e.preventDefault();
              setUsername(e.target.value);
            }} />
            <br />
            {username === "" ? "Please enter a username" : ""}
            <br />
            <input type="radio" name="myRadios" onChange={(e)=>{
              e.preventDefault();
              setDifficulty(1)}} value={difficulty} checked={difficulty === 1}/>Easy
            <input type="radio" name="myRadios" onChange={(e)=>{
              e.preventDefault();
              setDifficulty(2)}} value={difficulty} checked={difficulty === 2}/>Medium
            <input type="radio" name="myRadios" onChange={(e)=>{
              e.preventDefault();
              setDifficulty(3)}} value={difficulty} checked={difficulty === 3}/>Hard
            <br />
            <button onClick={(e) => {
              e.preventDefault();
              setClickPlay(0);
            }}>Cancel</button>
            <button type='submit' style={{ marginLeft: '10px', marginTop: '10px' }}>Start</button>
          </form>
        </>}

      <Count loading={loading} text={text}></Count>

      <div style={clickPlay === 2 ? { display: 'block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '50px' } : { display: 'none' }}>
        Time: {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:{time.seconds < 10 ? `0${time.seconds}` : time.seconds}:{time.milliseconds < 10 ? `0${time.milliseconds}` : time.milliseconds}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <p>Errors: {errors}</p>
          <p>Difficulty: {difficulty === 1 ? "Easy" : difficulty === 2 ? 'Medium' : "Hard"}</p>
          <button style={{ height: '50px' }} onClick={resetGame}>Reset Game</button>
        </div>
        <div className={styles.cardboard} style={{ display: 'grid', marginLeft: '-50px' }}>
          {board.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <div key={col.id} className={`tile ${col.flipped ? 'is-flipped' : ''}`}>
                <div class="tile__face tile__face--front"
                  style={{ cursor: col.clickable ? 'pointer' : 'not-allowed' }}
                  onClick={() => flipCard(rowIndex, colIndex)}>
                  {!col.flipped && !col.matched ? 
                    <img src={'back-kch.jpg'}
                    className={styles.card}/> 
                    : 
                    <img src={`${col.card}.jpg`}
                    className={styles.card}
                  />
                  }

                </div>
                <div class="tile__face tile__face--back">
                  <img src={`${col.card}.jpg`}
                    className={styles.card}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}