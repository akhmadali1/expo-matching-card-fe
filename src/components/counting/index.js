import React, { useEffect } from 'react'

export default function Count({ loading, text }) {
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : 'auto';
  }, [loading]);
  return (
    <>
      <style>
        {
          ` 
                    .overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 9999;
                        opacity: ${loading ? '1' : '0'};
                        pointer-events: ${loading ? 'auto' : 'none'};
                        transition: opacity 0.3s ease-in-out; /* Smooth transition */
                      }
            
                    .loading-container {
                        opacity: ${loading ? '1' : '0'};
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
                      }

                      .loading-container p {
                        font-size: 100px;
                        color: #000;
                      }
                    `
        }
      </style>
      <div style={{overflow:'hidden'}}>
        <div className="loading-container">
          <p>{text}</p>
        </div>
        <div className="overlay"></div>
      </div>
    </>
  )
}
