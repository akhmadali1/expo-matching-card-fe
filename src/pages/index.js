import { useState, useEffect, useRef } from 'react';
import useScore from './api/score';
import { Encrypt } from '@/lib/crypto';
import StageOne from '@/components/game/stage-one';
import Scoreboard from '@/components/game/scoreboard';
import Game from '@/components/game';

export default function MatchingCardGame() {

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

  const [gameStart, setGameStart] = useState(false);
  const gameStartSetting = (value) => {
    setGameStart(value);
  }

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
    setClickPlay(0);
    setDifficulty(1);
  };

  const resultGame = async (errors, timeCount) => {
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
      return true;

    } catch (error) {
      // Handle error from PostScoreAPI or any other error handling logic
      console.error('Error occurred while posting score:', error);
      return false;
    }
  }


  return (

    <div className='container-bg'>
      <svg viewBox="0 0 553 594" fill="none" xmlns="http://www.w3.org/2000/svg" className='container-bg__svg-right'>
        <path d="M66.7492 -102.486C101.588 -126.201 131.617 -150.052 156.667 -172.197C282.376 -344.728 276.241 -277.903 156.667 -172.197C155.393 -170.449 154.106 -168.676 152.805 -166.879C-3.77379 49.4863 260.286 -311.181 377.051 4.89337C439.259 173.288 398.138 284.218 376.315 344.616C384.925 360.244 388.575 379.49 390.344 400.302C402.927 399.952 420.987 397.022 446.145 391.603C645.752 348.616 713.689 608.686 503.37 593.346C376.025 584.058 397.162 480.538 390.344 400.302C356.28 401.251 362.34 383.296 376.315 344.616C363.297 320.987 338.941 305.628 292.602 305.628C97.458 305.628 340.363 -26.3174 106.834 -20.0744C76.5012 -19.2635 53.9412 -18.2962 37.5726 -17.3409C6.00554 -9.85706 -28.2112 -13.5018 37.5726 -17.3409C58.6233 -22.3316 78.4956 -32.2711 66.7492 -50.4019C39.7541 -92.0695 55.5013 -102.486 66.7492 -102.486Z" fill="#08793F" fillOpacity="0.4" />
      </svg>
      <img src={'logo-kalbe-black-1.webp'} className='container-bg__svg-logo' />
      <svg width="529" height="368" viewBox="0 0 529 368" fill="none" xmlns="http://www.w3.org/2000/svg" className='container-bg__svg-left'>
        <path d="M291.561 117.507C496.474 -160.389 -127.737 141.397 -148.789 144.559L-173 1045H147C125.83 1020.88 103.421 940.587 183.14 812.424C282.79 652.221 649.105 196.038 489.105 180.931C329.105 165.824 86.6492 395.404 291.561 117.507Z" fill="#08793F" fillOpacity="0.4" />
      </svg>
      <div className='container' style={{paddingTop:'120px'}}>
        <audio ref={audioRef} loop autoPlay>
          <source src="bg-music.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
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
        {gameStart || clickPlay === 2 &&
          <>
            <Game setClickPlay={clickPlaySetting} resultGame={resultGame} />
          </>
        }

      </div>
    </div>
  );
}