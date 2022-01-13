import { useState } from "react";
const client = new WebSocket('ws://localhost:4000')
const sendData = (data) => {
  client.send(JSON.stringify(data));
};
const useConnectFour = () => {
  const [player, setPlayer] = useState([]);
  const [status, setStatus] = useState({});
  const [roomId, setRoomId] = useState('')
  const playConnectFour = (payload) => { sendData(["ConnectFour", payload]);}
  const leaveConnectFour = (payload) => { sendData(["LeaveConnectFour", payload])}
  
  client.onmessage = (byteString) => {
    const { data } = byteString;
    const [task, payload] = JSON.parse(data); 
    switch (task) {
      case "Enter": {
        setPlayer(() => [...player, ...payload])
        if(roomId==='')
          setRoomId(() => payload[0].roomId)
        break;
      }
      case "status": {
        setStatus(() => payload); 
        break;
      }
      case "Leave": {
        const temp = player.fliter((e)=>{return e !== payload})
        console.log(temp)
        setPlayer(()=>temp)
        break;
      }
      default: 
        break;
    }
  }

  return {
    player,
    status,
    roomId,
    playConnectFour,
    leaveConnectFour
 };
};

export default useConnectFour;
