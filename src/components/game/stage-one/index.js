import React from 'react'
import { truncateString } from '@/lib/truncate-string';

export default function StageOne(props) {
    const { dataScoreBoard, username, difficulty, audioRef, setUsername, setDifficulty, setClickPlay } = props;

    let dataScoreBoardChild = dataScoreBoard;
    if (!dataScoreBoard || dataScoreBoard.length < 3) {
        dataScoreBoardChild = [];
    }

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
    return (
        <>
            <h1>Top 3</h1>
            <div className="podium-container">
                <div className="podium">
                    <div className="podium__front podium__left">
                        <div className="">2</div>
                        <div className="podium__image"><p style={{ fontSize: '30px' }}>{truncateString(dataScoreBoardChild[1]?.Username, 5, "...")}</p></div>
                    </div>
                    <div className="podium__front podium__center">
                        <div className="">1</div>
                        <div className="podium__image"><p style={{ fontSize: '30px' }}>{truncateString(dataScoreBoardChild[0]?.Username, 5, "...")}</p></div>
                    </div>
                    <div className="podium__front podium__right">
                        <div className="">3</div>
                        <div className="podium__image"><p style={{ fontSize: '30px' }}>{truncateString(dataScoreBoardChild[2]?.Username, 5, "...")}</p></div>
                    </div>
                </div>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (username !== "") {
                    playAudio();
                    setClickPlay(1);
                }
            }} >
                <label htmlFor="fname">Username:</label><br />
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
        </>
    )
}
