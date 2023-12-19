import { Button } from 'primereact/button';
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
            <div style={{ textAlign: 'center', paddingTop:'100px' }}>
                Scoreboard
                <div style={{ width: '100%', marginTop: '5px', overflow: 'auto', height: '50vh' }}>
                    <table border="1" cellPadding="10" style={{ tableLayout: 'fixed', borderCollapse: 'collapse', margin: '0 auto', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{padding:'10px'}}>Rank</th>
                                <th style={{padding:'10px'}}>Username</th>
                                <th style={{padding:'10px'}}>Score</th>
                                <th style={{padding:'10px'}}>Time</th>
                                <th style={{padding:'10px'}}>Error</th>
                                <th style={{padding:'10px'}}>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataScoreBoard.map((item, index) => (
                                <>
                                    <tr>
                                        <td style={{padding:'10px'}}>{index + 1}</td>
                                        <td style={{padding:'10px'}}>{item.Username}</td>
                                        <td style={{padding:'10px'}}>{item.Score}</td>
                                        <td style={{padding:'10px'}}>{formatTime(item.Time)}</td>
                                        <td style={{padding:'10px'}}>{item.Error}</td>
                                        <td style={{padding:'10px'}}>{item.Difficulty === 1 ? "Easy" : item.Difficulty === 2 ? "Medium" : item.Difficulty === 3 ? "Hard" : ''}</td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button style={{ backgroundColor:'#14b8a6' }} className='w-6 py-1' label="Back" color='primary' onClick={(e) => {
                    e.preventDefault();
                    setClickPlay(1);
                }}/>
            </div>
        </>
    )
}
