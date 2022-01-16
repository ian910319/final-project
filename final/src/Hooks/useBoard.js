import { useState } from "react";
const client = new WebSocket('ws://localhost:4000')
const sendData = (data) => {
  client.send(JSON.stringify(data));
};
const useBoard = () => {
    const [board, setBoard] = useState([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ]);
    const [gameOver, setGameOver] = useState(0)
    const [turn, setTurn] = useState(true)
    const [myRoom, setMyRoom] = useState('')
    const putChess = (payload) => { sendData(["Play", payload]);}
    const restart = (payload) =>{sendData(["Restart", payload])}
    client.onmessage = (byteString) => {
        const { data } = byteString;
        const [task, payload] = JSON.parse(data); 
        switch (task) {
            case "Move": {
                console.log(payload.roomId)
                console.log(myRoom)
                if(payload.roomId === myRoom){
                    setBoard(()=>payload.board)
                    setTurn(()=>!turn)
                }
                break
            }
            case "GameOver": {
                if(payload.roomId === myRoom)
                    setGameOver(payload.result)
                break;
            }
            case "Restart": {
                if(payload.roomId === myRoom){
                    setGameOver(0)
                    setBoard(()=>payload.board)
                    setTurn(()=>!turn)
                }
                break;
            }
            default: 
                break;
        }
      }
    return {
        board,
        gameOver,
        turn,
        setMyRoom,
        setTurn,
        putChess,
        restart
    };
};

export default useBoard;
