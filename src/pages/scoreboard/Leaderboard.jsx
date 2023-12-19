import useLeaderboard from '@/pages/api/leaderboard/leaderboard';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { use, useEffect, useRef } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';

const leaderboardData = [
  { email: 'john@example.com', score: 1000 },
  { email: 'alice@example.com', score: 950 },
  { email: 'bob@example.com', score: 900 },
  { email: 'jane@example.com', score: 850 },
  { email: 'alex@example.com', score: 820 },
  { email: 'dex@example.com', score: 800 },
  { email: 'ryan@example.com', score: 800 },
  { email: 'andrian.santo@sakafarma.com', score: 800 },
  { email: 'jason@example.com', score: 800 },
  { email: 'widya@example.com', score: 800 },
  { email: 'muhammad.sudirjo@kalbeconsumerhealth.co.id', score: 800 },
  // Add more data here...
];
const rowsPerPage = 1000; // Number of rows per page


const getRankColor = (index) => {
  if (index === 0) return '#ffcc00'; // Rank 1 color (Gold)
  if (index === 1) return '#c0c0c0'; // Rank 2 color (Silver)
  if (index === 2) return '#cd7f32'; // Rank 3 color (Bronze)
  return '#f7fcff'; // Default rank color (Light Blue)
};

const Leaderboard = (props) => {
  const router = useRouter()
  const {user} =props
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false)
  const currentUserEmail = user?.email
  
  const {GetLB} = useLeaderboard()

  const [lbData, setLbData] = useState(null);
  const [cleanData, setCleanData] = useState(null);
  const [myData, setMyData] = useState(null);

  const totalPages = Math.ceil(leaderboardData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const leaderboardRef = useRef(null);

  const handleScrollToCurrentUser = () => {
    const currentUserIndex = leaderboardData.findIndex(item => item.email === currentUserEmail);
    if (currentUserIndex !== -1) {
      const rowRef = leaderboardRef.current.querySelector(`[data-index="${currentUserIndex}"]`);
      if (rowRef) {
        rowRef.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Filter and rank the data based on the score
  const sortedData = cleanData != null ? cleanData.sort((a, b) => b.score - a.score) : null;
  const filteredData = cleanData != null ? sortedData.filter(item => item.email.toLowerCase().includes(searchEmail.toLowerCase())) : null;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const hideEmail = (email) =>{
    let maskid = "";
    let myemailId =  email;
    var prefix= myemailId.substring(0, myemailId .lastIndexOf("@"));
    var postfix= myemailId.substring(myemailId .lastIndexOf("@"));

    for(var i=0; i<prefix.length; i++){
        if(i == 0 || i == prefix.length - 1) {   ////////
            maskid = maskid + prefix[i].toString();
        }
        else {
            maskid = maskid + "*";
        }
    }

    // Using Regex
     //   return email.replace(
  //     /(..)(.{2,4})(?=.*@)/g,
  //     (_, a, b) => a + '*'.repeat(b.length)
  // );

    return maskid +postfix;
  }

  // Handler for fetching all master data
  const GetMasterData = async () => {
    setLoading(true)
    let getleaderpoint = await GetLeaderPoint()
    if(getleaderpoint == null) return setLoading(false);
    setLoading(false)
  }

  // Handle Master Brand
  const GetLeaderPoint = async () => {
    setLoading(true)
    console.log(user)
    let getdata = await GetLB({User_id: user.id})
    // let getdata= null
    
    // console.log("getdata", getdata)
    if(getdata == undefined || getdata == null || getdata.length <1) return null;
    // let insidedata = []
    // await getdata?.data.map((item) =>
    //   insidedata.push({
    //     ...item,
    //     label: item.branch_name,
    //     value: item.id
    //   })
    // )
    // console.log("test")
    setLbData(getdata)
    setLoading(false)
    return 0
  }

useEffect(()=>{
    GetMasterData()
}, [])

useEffect(()=>{
  // console.log("lb data:", lbData)

  if(lbData == null){
    return
  }
  if(cleanData != null){
    return
  }
  let lbTmp = []
  lbData.data_leaderboard.map((x, i)=>{
    lbTmp.push(x)
  })
  // lbTmp.push(lbData.data_current_score)

  setMyData(lbData.data_current_score)
  setCleanData(lbTmp)
},[lbData])

useEffect(()=>{
  console.log("cleandata", cleanData)
}, [cleanData])

  return (
    <div className="leaderboard" ref={leaderboardRef}>
      <div>
          <h2>Leaderboard</h2>
      
      </div>
      <div className='flex flex-wrap justify-content-between'>
        <div className="leaderboard-header">
            <Button size='small'
            className='mx-1' severity='success'
            onClick={()=>router.push("/submission")} label='Submission'/>
        </div>
        <div className='flex justify-content-end'>
          {/* <div>
            <Button size='small' severity='info'
            onClick={handleScrollToCurrentUser} label='My Ranking'/>
          </div> */}
          <div className="search-container mx-2">
            <input
              type="text"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="leaderboard-content">
        <h4>My Rank:</h4>
        {
          myData == null
          ?
          null
          :
        <div
              key={myData?.rank}
              className={`leaderboard-item ${myData?.rank < 3 ? 'top-rank' : ''} current-user}`}
              style={{
                backgroundColor: '#67b3f5',
                borderColor: '#000000' ,
              }}
              data-index={myData?.rank}
            >
              <div className={`rank ${myData?.rank < 3 ? 'top-rank-text' : ''}`}>
                {myData?.rank}
              </div>
              <div className="email text-overflow-clip overflow-hidden"
              style={{
                fontWeight: "bolder" ,
                color: "white"
              }}
              >{myData?.email}</div>
              <div className="score mx-4"
              style={{
                fontWeight: "bolder",
                color: "white"
              }}
              >{myData?.score}</div>
          </div>
        }
        <br/>
        <br/>

        <h4>Leaderboard Rank:</h4>
        {
          cleanData == null 
          ? 
          <></>
          :
        filteredData.slice(startIndex, endIndex).map((item, index) => {
          const originalIndex = sortedData.findIndex(entry => entry.email === item.email);
          const isCurrentUser = item.email === currentUserEmail;
          // console.log(isCurrentUser)
          return (
            <div
              key={originalIndex}
              className={`leaderboard-item ${originalIndex < 3 ? 'top-rank' : ''} ${isCurrentUser ? 'current-user' : ''}`}
              style={{
                backgroundColor: isCurrentUser ? '#67b3f5': getRankColor(originalIndex),
                borderColor: isCurrentUser ? '#000000' : 'transparent',
              }}
              data-index={originalIndex}
            >
              <div className={`rank ${originalIndex < 3 ? 'top-rank-text' : ''}`}>
                {originalIndex + 1}
              </div>
              <div className="email text-overflow-clip overflow-hidden"
              style={{
                fontWeight: isCurrentUser ? "bolder" : "normal",
                color: isCurrentUser ? "white" : null
              }}
              >{hideEmail(item.email)}</div>
              <div className="score mx-4"
              style={{
                fontWeight: isCurrentUser ? "bolder" : "normal",
                color: isCurrentUser ? "white" : "black"
              }}
              >{item.score}</div>
            </div>
          );
        })}
      </div>
      {/* <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div> */}
      <style jsx>{`
        .leaderboard {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .leaderboard-header {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .leaderboard-content {
          display: flex;
          flex-direction: column;
        }
        .leaderboard-item {
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent; /* Add outer border to each row */
        }
        .rank {
          width: 30px;
          height: 30px;
          color: #fff; /* Set rank text color to black */
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          margin-right: 10px;
          background-color: #1e90ff;
          display: flex;
          border-radius: 50%;
        }
        .top-rank {
          font-weight: bold;
        }
        .email {
          flex: 1;
        }
        .score {
          font-weight: bold;
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        .pagination button {
          padding: 5px 10px;
        }
        .search-container {
          margin-bottom: 10px;
        }
        .search-container input {
          padding: 5px;
        }
        .current-user {
          background-color: #e6f7ff; /* Light blue background for the current user */
          border-color: #1e90ff; /* Blue border for the current user */
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
