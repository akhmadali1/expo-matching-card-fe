import getRandomNumber from "@/lib/random-number";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function FilterGame() {
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [clickPlay, setClickPlay] = useState(0);
  const [random, setRandom] = useState(0);

  return (
    <>
      <style>
        {
          `
          .filter{
            width:280px;
          }
          @media only screen and (min-width: 600px) {
            .filter{
              width:550px;
            }
          }
          `
        }
      </style>

      <div className='container-bg'>
        <svg viewBox="0 0 553 594" fill="none" xmlns="http://www.w3.org/2000/svg" className='container-bg__svg-right'>
          <path d="M66.7492 -102.486C101.588 -126.201 131.617 -150.052 156.667 -172.197C282.376 -344.728 276.241 -277.903 156.667 -172.197C155.393 -170.449 154.106 -168.676 152.805 -166.879C-3.77379 49.4863 260.286 -311.181 377.051 4.89337C439.259 173.288 398.138 284.218 376.315 344.616C384.925 360.244 388.575 379.49 390.344 400.302C402.927 399.952 420.987 397.022 446.145 391.603C645.752 348.616 713.689 608.686 503.37 593.346C376.025 584.058 397.162 480.538 390.344 400.302C356.28 401.251 362.34 383.296 376.315 344.616C363.297 320.987 338.941 305.628 292.602 305.628C97.458 305.628 340.363 -26.3174 106.834 -20.0744C76.5012 -19.2635 53.9412 -18.2962 37.5726 -17.3409C6.00554 -9.85706 -28.2112 -13.5018 37.5726 -17.3409C58.6233 -22.3316 78.4956 -32.2711 66.7492 -50.4019C39.7541 -92.0695 55.5013 -102.486 66.7492 -102.486Z" fill="#08793F" fillOpacity="0.4" />
        </svg>
        <img src={'logo-kalbe-black-1.webp'} className='container-bg__svg-logo' />
        <svg width="529" height="368" viewBox="0 0 529 368" fill="none" xmlns="http://www.w3.org/2000/svg" className='container-bg__svg-left'>
          <path d="M291.561 117.507C496.474 -160.389 -127.737 141.397 -148.789 144.559L-173 1045H147C125.83 1020.88 103.421 940.587 183.14 812.424C282.79 652.221 649.105 196.038 489.105 180.931C329.105 165.824 86.6492 395.404 291.561 117.507Z" fill="#08793F" fillOpacity="0.4" />
        </svg>
        {clickPlay === 0 &&
          <div className='container' style={{ paddingTop: '200px' }}>
            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
              <img className="filter" src={'filter.webp'} />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>

                <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px', marginTop: '20px', width: '100%', height: 'auto', paddingBottom: '20px' }} onSubmit={(e) => {
                  e.preventDefault();
                  if (username !== "") {
                    setClickPlay(1);
                    const randomize = getRandomNumber(2);
                    setRandom(randomize);
                  }
                }}>
                  <span className="p-float-label w-6">
                    <InputText id="username" className='w-full p-2' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="username">Username</label>
                  </span>
                  <Button style={{ backgroundColor: '#14b8a6' }} className='w-6 py-2' label="Submit" color='primary' type='submit' htmlType="submit" />
                </form>
              </div>
            </div>
          </div>
        }
        {clickPlay === 1 &&
          <>
            <div className='container' style={{ paddingTop: '200px' }}>
              <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                {random > 0 &&
                  <img width={350} src={`qr-${random}.jpg`} />
                }
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>

                  <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px', marginTop: '20px', width: '100%', height: 'auto', paddingBottom: '20px' }} onSubmit={(e) => {
                    e.preventDefault();
                    if (score > 0) {
                      setClickPlay(0);
                      setRandom(0);
                    }
                  }}>
                    <span className="p-float-label w-6">
                      <InputText id="score" className='w-full p-2' value={score} onChange={(e) => setScore(e.target.value)} />
                      <label htmlFor="score">Score</label>
                    </span>
                    <div className="flex w-full gap-2">
                      <Button style={{ backgroundColor: '#d9342b' }} className='w-6 py-2' label="Back" color='primary' onClick={(e) => {
                        setClickPlay(0);
                        setRandom(0);
                      }} />
                      <Button style={{ backgroundColor: '#14b8a6' }} className='w-6 py-2' label="Submit" color='primary' type='submit' htmlType="submit" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </>
  );
}