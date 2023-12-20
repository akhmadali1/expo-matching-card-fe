import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react'

export default function Scoreboard(props) {
    const { dataScoreBoard, setClickPlay } = props;
    const [nameFilter, setNameFilter] = useState('');

    const filteredData = dataScoreBoard.filter(
        (item) =>
            item.Username.toLowerCase().includes(nameFilter.toLowerCase())
    );


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
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                Scoreboard
                <div style={{ width: '100%', marginTop: '5px', overflow: 'auto', height: '50vh' }}>
                    <table border="1" cellPadding="10" style={{ tableLayout: 'fixed', borderCollapse: 'collapse', margin: '0 auto', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px' }}>Rank</th>
                                <th style={{ padding: '10px' }}>Username</th>
                                <th style={{ padding: '10px' }}>Score</th>
                                <th style={{ padding: '10px' }}>Time</th>
                                <th style={{ padding: '10px' }}>Error</th>
                                <th style={{ padding: '10px' }}>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <>
                                    <tr>
                                        <td style={{ padding: '10px' }}>{item.Rank}</td>
                                        <td style={{ padding: '10px' }}>{item.Username}</td>
                                        <td style={{ padding: '10px' }}>{item.Score}</td>
                                        <td style={{ padding: '10px' }}>{formatTime(item.Time)}</td>
                                        <td style={{ padding: '10px' }}>{item.Error}</td>
                                        <td style={{ padding: '10px' }}>{item.Difficulty === 1 ? "Basic" : item.Difficulty === 2 ? "Advance" : item.Difficulty === 3 ? "Hard" : ''}</td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="card flex flex-column align-items-center justify-content-center">
                    <InputText placeholder='Find Your Name' className='my-4 w-6 py-2 z-5' onChange={(e)=>{setNameFilter(e.target.value)}}></InputText>
                    <Button style={{ backgroundColor: '#14b8a6' }} className='w-6 py-1 z-5' label="Back" color='primary' onClick={(e) => {
                        e.preventDefault();
                        setClickPlay(1);
                    }} />
                </div>
            </div>
        </>
    )
}
