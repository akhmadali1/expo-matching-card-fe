import { useState, useEffect, useRef } from 'react';
import Count from '@/components/counting';
import styles from '@/styles/_match-card.module.scss'
import useScore from './api/score';
import { Encrypt } from '@/lib/crypto';
import { truncateString } from '@/lib/truncate-string';
import StageOne from '@/components/game/stage-one';
import Scoreboard from '@/components/game/scoreboard';
import Game from '@/components/game';

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
];


export default function MatchingCardGame() {

  const [rows, setRows] = useState(4);
  const [columns, setColumns] = useState(5);
  const audioRef = useRef(null);

  const [clickPlay, setClickPlay] = useState(0);
  const clickPlaySetting = (value) => {
    setClickPlay(value);
  }

  const [username, setUsername] = useState("");
  const usernameSetting = (value) => {
    setUsername(value);
  }

  const [difficulty, setDifficulty] = useState(1);
  const difficultySetting = (value) => {
    setDifficulty(value);
  }

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

  useEffect(() => {
    if (selectedCards.length === 2) {
      const timeout = setTimeout(() => {
        checkForMatch();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [selectedCards]);

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

  return (

    <div className='container-bg'>
      <svg viewBox="0 0 553 594" fill="none" xmlns="http://www.w3.org/2000/svg" className='container-bg__svg-right'>
        <path d="M66.7492 -102.486C101.588 -126.201 131.617 -150.052 156.667 -172.197C282.376 -344.728 276.241 -277.903 156.667 -172.197C155.393 -170.449 154.106 -168.676 152.805 -166.879C-3.77379 49.4863 260.286 -311.181 377.051 4.89337C439.259 173.288 398.138 284.218 376.315 344.616C384.925 360.244 388.575 379.49 390.344 400.302C402.927 399.952 420.987 397.022 446.145 391.603C645.752 348.616 713.689 608.686 503.37 593.346C376.025 584.058 397.162 480.538 390.344 400.302C356.28 401.251 362.34 383.296 376.315 344.616C363.297 320.987 338.941 305.628 292.602 305.628C97.458 305.628 340.363 -26.3174 106.834 -20.0744C76.5012 -19.2635 53.9412 -18.2962 37.5726 -17.3409C6.00554 -9.85706 -28.2112 -13.5018 37.5726 -17.3409C58.6233 -22.3316 78.4956 -32.2711 66.7492 -50.4019C39.7541 -92.0695 55.5013 -102.486 66.7492 -102.486Z" fill="#08793F" fillOpacity="0.4" />
      </svg>
      <img src={'logo-kalbe-black-1.webp'} className='logo' />
      <svg width="529" height="368" viewBox="0 0 529 368" fill="none" xmlns="http://www.w3.org/2000/svg" className='container-bg__svg-left'>
        <path d="M291.561 117.507C496.474 -160.389 -127.737 141.397 -148.789 144.559L-173 1045H147C125.83 1020.88 103.421 940.587 183.14 812.424C282.79 652.221 649.105 196.038 489.105 180.931C329.105 165.824 86.6492 395.404 291.561 117.507Z" fill="#08793F" fillOpacity="0.4" />
      </svg>
      <div className='container'>
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
            backface-visibility: hidden;
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
        <Count loading={loading} text={text}></Count>
        {clickPlay === -1 &&
          <>
            <Scoreboard dataScoreBoard={dataScoreBoard} setClickPlay={clickPlaySetting} />
          </>
        }
        {clickPlay === 0 &&
          <>
            <StageOne dataScoreBoard={dataScoreBoard} username={username} difficulty={difficulty} audioRef={audioRef} setUsername={usernameSetting} setDifficulty={difficultySetting} setClickPlay={clickPlaySetting} />
          </>
        }
        {
          clickPlay === 1 &&
          <>
            <div style={{ textAlign: 'center' }}>
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
              <button style={{ marginTop: '10px', marginLeft: '10px', padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }} onClick={(e) => {
                e.preventDefault();
                setClickPlay(-1);
              }}>Score Board</button>
            </div>
          </>
        }
        {clickPlay === 2 && 
        <>
          <Game/>
        </>
        }

      </div>
    </div>
  );
}