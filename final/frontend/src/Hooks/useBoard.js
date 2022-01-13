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
    const putChess = (payload) => { sendData(["Play", payload]);}
    const restart = (payload) =>{sendData(["Restart", payload])}
    client.onmessage = (byteString) => {
        const { data } = byteString;
        const [task, payload] = JSON.parse(data); 
        switch (task) {
            case "Move": {
                setBoard(()=>payload.board)
                setTurn(()=>!turn)
                break
            }
            case "GameOver": {
                setGameOver(payload.result)
                break;
            }
            case "Restart": {
                setGameOver(0)
                setBoard(()=>payload.board)
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
        setTurn,
        putChess,
        restart
    };
};

export default useBoard;
