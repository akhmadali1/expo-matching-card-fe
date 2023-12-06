import { useState, useEffect, useRef } from 'react';
import Count from '@/components/counting';
import styles from '@/styles/MatchingGame.module.css'
import useScore from './api/score';
import { Encrypt } from '@/lib/crypto';

const cardList = [
  'woods-yellow',
  'procold-purple',
  'sakatonik-blue',
  'fatigon-red',
  'marine-gummy-yellow',
  'promag-green',
];

const cardListMedium = [
  'xonce-red',
  'woods-yellow',
  'procold-purple',
  'sakatonik-blue',
  'fatigon-red',
  'marine-gummy-yellow',
  'promag-green',
  'entrostop-red'
  // 'xonce-red',
  // 'woods-yellow',
  // 'procold-purple',
  // 'sakatonik-blue',
  // 'kalpanax-red',
  // 'fatigon-red',
  // 'entrostop-red',
  // 'marine-gummy-purple',
  // 'promag-green',
  // 'sakatonik-purple',
];

const cardListHard = [
  'xonce-red',
  'woods-yellow',
  'procold-purple',
  'sakatonik-blue',
  'fatigon-red',
  'marine-gummy-yellow',
  'sakatonik-pink',
  'marine-gummy-orange',
  'promag-green',
  'entrostop-red'
  // 'xonce-red',
  // 'mixagrip-red',
  // 'kalpanax-red',
  // 'fatigon-red',
  // 'entrostop-red',
  // 'marine-gummy-purple',
  // 'procold-purple',
  // 'sakatonik-purple',
  // 'woods-yellow',
  // 'promag-green'
];


export default function MatchingCardGame() {

  const [rows, setRows] = useState(4);
  const [columns, setColumns] = useState(5);

  const generateInitialBoard = (difficulty) => {
    let cardListDifficulty = cardListHard;
    let difficultyGameRows = 4
    let difficultyGameColumns = 5
    if (difficulty === 1) {
      cardListDifficulty = cardList;
      difficultyGameRows = 3
      difficultyGameColumns = 4
    } else if (difficulty === 2) {
      cardListDifficulty = cardListMedium;
      difficultyGameRows = 4
      difficultyGameColumns = 4
    }

    const cards = cardListDifficulty.concat(cardListDifficulty);
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    const initialBoard = [];

    let cardIndex = 0;

    for (let i = 0; i < difficultyGameRows; i++) {
      const row = [];
      for (let j = 0; j < difficultyGameColumns; j++) {
        let card = shuffledCards[cardIndex];

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
    setRows(4);
    setColumns(5);
    setErrors(0);
    setClickPlay(0);
    setDifficulty(1);
    setUsername("");
    resetStopwatch();
  };

  const flipCard = (row, col) => {
    const currentCard = board[row][col];
    if (currentCard.matched || selectedCards.length === 2 || !currentCard.clickable) {
      return;
    }
  
    const updatedBoard = board.map((r, rowIndex) =>
      r.map((c, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...c, flipped: true, clickable: false };
        }
        return c;
      })
    );
  
    setSelectedCards([...selectedCards, currentCard]);
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
          if (difficulty === 1) {
            setRows(3);
            setColumns(4);
          } else if (difficulty === 2) {
            setRows(4);
            setColumns(4);
          } else if (difficulty === 3) {
            setRows(4);
            setColumns(5);
          }
          setBoard(generateInitialBoard(difficulty));
          startStopwatch();
          i = 0;
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameStart]);

  const calculateScore = (difficulty, timeCount, errors) => {

    let difficultyMultiplier = 1;
    if (difficulty === 2) {
      difficultyMultiplier = 0.65;
    } else if (difficulty === 1) {
      difficultyMultiplier = 0.45;
    }

    const baseScore = 120000;
    const errorPenalty = errors * 20;

    let score = Math.max(0, (baseScore * difficultyMultiplier) - errorPenalty - timeCount);

    const minimumScore = 5;

    if (score < minimumScore) {
      score = minimumScore;
    }

    return score;
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
          difficulty
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

  const audioRef = useRef(null);

  const playAudio = () => {
    const audio = audioRef.current;

    // Check if the audio is paused or hasn't started
    if (audio.paused || audio.ended) {
      audio.play().catch(error => {
        // Autoplay was prevented; handle it here
        console.error('Autoplay prevented:', error);
      });
    }
  };

  function truncateString(str, maxLength) {
    if (str?.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  }


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
      <audio ref={audioRef} loop autoPlay>
        <source src="bg-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div style={clickPlay === -1 ? { textAlign: 'center' } : { display: 'none' }}>
        Scoreboard
        <div style={{ width: '100%', marginTop: '5px', overflow: 'auto', height: '70vh' }}>
          <table border="1" cellPadding="10" style={{ tableLayout: 'fixed', borderCollapse: 'collapse', margin: '0 auto', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Score</th>
                <th>Time</th>
                <th>Error</th>
                <th>Difficulty</th>
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
                    <td>{item.Difficulty === 1 ? "Easy" : item.Difficulty === 2 ? "Medium" : item.Difficulty === 3 ? "Hard" : ''}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <button style={{ marginLeft: '10px', padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }} onClick={(e) => {
              e.preventDefault();
              setClickPlay(1);
            }}>Back</button>
      </div>
      <div style={clickPlay == 1 ? { textAlign: 'center' } : { display: 'none' }}>
        <h1>Top 3</h1>
        <div class="podium-container">
          <div class="podium">
            <div class="podium__front podium__left">
              <div class="">2</div>
              <div class="podium__image"><p style={{fontSize:'30px'}}>{truncateString(dataScoreBoard[1]?.Username,5)}</p></div>
            </div>
            <div class="podium__front podium__center">
              <div class="">1</div>
              <div class="podium__image"><p style={{fontSize:'30px'}}>{truncateString(dataScoreBoard[0]?.Username,5)}</p></div>
            </div>
            <div class="podium__front podium__right">
              <div class="">3</div>
              <div class="podium__image"><p style={{fontSize:'30px'}}>{truncateString(dataScoreBoard[2]?.Username,5)}</p></div>
            </div>
          </div>
        </div>
        <h1>Welcome to Cards Match</h1>
        <button style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }} onClick={(e) => {
          e.preventDefault();
          setGameStart(true);
        }}>
          Play
        </button>
        <button style={{ marginLeft: '10px', padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }} onClick={(e) => {
              e.preventDefault();
              setClickPlay(0);
            }}>Back</button>
        <button style={{ marginTop:'10px',marginLeft: '10px', padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }} onClick={(e) => {
              e.preventDefault();
              setClickPlay(-1);
            }}>Score Board</button>
      </div>
      {clickPlay == 0 &&
        <>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (username !== "") {
              playAudio();
              setTime({ minutes: 0, seconds: 0, milliseconds: 0 });
              setClickPlay(1);
            }
          }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <label for="fname">Username:</label><br />
            <input type="text" value={username} name="username" onChange={(e) => {
              e.preventDefault();
              setUsername(e.target.value);
            }} />
            <br />
            <p style={{ whiteSpace: 'nowrap' }}>{username === "" ? "Please enter a username" : ""}</p>
            <br />
            <div style={{ whiteSpace: 'nowrap' }}>
              <input type="radio" name="myRadios" onChange={(e) => {
                e.preventDefault();
                setDifficulty(1)
              }} value={difficulty} checked={difficulty === 1} />Easy
              <input type="radio" name="myRadios" onChange={(e) => {
                e.preventDefault();
                setDifficulty(2)
              }} value={difficulty} checked={difficulty === 2} />Medium
              <input type="radio" name="myRadios" onChange={(e) => {
                e.preventDefault();
                setDifficulty(3)
              }} value={difficulty} checked={difficulty === 3} />Hard
            </div>
            <br />
            <button type='submit' style={{ marginTop: '10px' }}>Start</button>
          </form>
        </>}

      <Count loading={loading} text={text}></Count>

      <div style={clickPlay === 2 ? { overflow: 'hidden', display: 'block', position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', padding: '50px' } : { display: 'none' }}>
        Time: {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:{time.seconds < 10 ? `0${time.seconds}` : time.seconds}:{time.milliseconds < 10 ? `0${time.milliseconds}` : time.milliseconds}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <p>Errors: {errors}</p>
          <p>Difficulty: {difficulty === 1 ? "Easy" : difficulty === 2 ? 'Medium' : "Hard"}</p>
          <button style={{ height: '50px' }} onClick={resetGame}>Reset Game</button>
        </div>
        <div className={styles.cardboard} style={{ display: 'grid' }}>
          {board.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <div key={col.id} className={`tile ${col.flipped ? 'is-flipped' : ''}`}>
                <div class="tile__face tile__face--front"
                  style={{ cursor: col.clickable ? 'pointer' : 'not-allowed' }}
                  onClick={() => col.clickable && flipCard(rowIndex, colIndex)}>
                  {!col.flipped && !col.matched ?
                    <img src={'back-kch.jpeg'}
                      className={styles.card} />
                    :
                    <img src={`${col.card}.jpeg`}
                      className={styles.card}
                    />
                  }

                </div>
                <div class="tile__face tile__face--back">
                  <img src={`${col.card}.jpeg`}
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