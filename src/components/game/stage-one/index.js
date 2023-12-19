import React, { useEffect } from 'react'
import { truncateString } from '@/lib/truncate-string';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';

export default function StageOne(props) {
    const { dataScoreBoard, username, difficulty, audioRef, setUsername, setDifficulty, setClickPlay } = props;

    // let dataScoreBoardChild = dataScoreBoard;
    // if (!dataScoreBoard || dataScoreBoard.length < 3) {
    //     dataScoreBoardChild = [];
    // }

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
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setDifficulty(e.target.value);
    };
    return (
        <>
            <h1>Top 3</h1>
            <div className="podium-container">
                <div className="podium">
                    <div className="podium__front podium__left">
                        <div className="">2</div>
                        <div className="podium__image"><p style={{ fontSize: '30px', color: 'black' }}>{truncateString(dataScoreBoard[1]?.Username, 5, "...")}</p></div>
                    </div>
                    <div className="podium__front podium__center">
                        <div className="">1</div>
                        <div className="podium__image"><p style={{ fontSize: '30px', color: 'black' }}>{truncateString(dataScoreBoard[0]?.Username, 5, "...")}</p></div>
                    </div>
                    <div className="podium__front podium__right">
                        <div className="">3</div>
                        <div className="podium__image"><p style={{ fontSize: '30px', color: 'black' }}>{truncateString(dataScoreBoard[2]?.Username, 5, "...")}</p></div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'auto', paddingBottom: '20px' }}>

                <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '15px', marginTop: '20px', width: '280px', height: 'auto' }} onSubmit={(e) => {
                    e.preventDefault();
                    if (username !== "") {
                        playAudio();
                        setClickPlay(1);
                    }
                }}>
                    <span className="p-float-label w-full">
                        <InputText id="username" className='w-full p-2' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <label htmlFor="username">Username</label>
                    </span>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton inputId="ingredient1" onChange={(e) => setDifficulty(1)} checked={difficulty === 1} />
                            <label htmlFor="ingredient1" className="ml-2">Basic</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="ingredient2" onChange={(e) => setDifficulty(2)} checked={difficulty === 2} />
                            <label htmlFor="ingredient2" className="ml-2">Advance</label>
                        </div>
                    </div>
                    <Button style={{ backgroundColor: '#14b8a6' }} className='w-full py-1' label="Submit" color='primary' type='submit' htmlType="submit" />
                </form>
            </div>
        </>
    )
}
