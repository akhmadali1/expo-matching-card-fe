import React from 'react'
import generateInitialBoard from '@/lib/make-board';
import Count from '../counting';
import styles from '@/styles/_match-card.module.scss'

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

export default function Game(props) {
    const { gameStart, difficulty, resultGame } = props;

    const [rows, setRows] = useState(4);
    const [columns, setColumns] = useState(5);
    const [board, setBoard] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState(0);
    const [errors, setErrors] = useState(0);
    const [loading, setLoading] = useState(true);
    const textCommand = ["Ready", "Set", "Go"]
    const [text, setText] = useState("");

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

    const resetGame = () => {
        setSelectedCards([]);
        setMatchedCards(0);
        setRows(4);
        setColumns(5);
        setErrors(0);
        resetStopwatch();
    };

    const [time, setTime] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });
    const [timeCount, setTimeCount] = useState(0);
    const intervalRef = useRef(null);

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
        const handleMatchedCards = async () => {
            if (matchedCards === rows * columns) {
                const flagResult = resultGame(errors, timeCount);
                if (flagResult) {
                    resetGame();
                }

            }
        };

        handleMatchedCards();
    }, [matchedCards]);

    return (
        <>
            <style>
                {`
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
            </style>
            <Count loading={loading} text={text}></Count>
            <div style={{ overflow: 'hidden', display: 'block', position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', padding: '50px' }}>
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
                                <div className="tile__face tile__face--front"
                                    style={{ cursor: col.clickable ? 'pointer' : 'not-allowed' }}
                                    onClick={() => col.clickable && flipCard(rowIndex, colIndex)}>
                                    {!col.flipped && !col.matched ?
                                        <img src={'back-kch.webp'}
                                            className={styles.card} />
                                        :
                                        <img src={`${col.card}.webp`}
                                            className={styles.card}
                                        />
                                    }

                                </div>
                                <div className="tile__face tile__face--back">
                                    <img src={`${col.card}.webp`}
                                        className={styles.card}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}
