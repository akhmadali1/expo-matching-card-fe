import React from 'react'

export default function Game() {
    const [time, setTime] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });
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
    return (
        <>
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
