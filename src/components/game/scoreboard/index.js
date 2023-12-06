import React from 'react'

export default function Scoreboard(props) {
    const { dataScoreBoard, setClickPlay } = props;

    let dataScoreBoardChild = dataScoreBoard;
    if (!dataScoreBoard || dataScoreBoard.length < 3) {
        dataScoreBoardChild = [];
    }
    
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
    return (
        <>
            <div style={{ textAlign: 'center' }}>
                Scoreboard
                <div style={{ width: '100%', marginTop: '5px', overflow: 'auto', height: '70vh' }}>
                    <table border="1" cellPadding="10" style={{ tableLayout: 'fixed', borderCollapse: 'collapse', margin: '0 auto', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Username</th>
                                <th>Score</th>
                                <th>Time</th>
                                <th>Error</th>
                                <th>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataScoreBoard.map((item, index) => (
                                <>
                                    <tr>
                                        <td>{index + 1}</td>
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
        </>
    )
}
