import { Layout, Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import Board from '../Components/ConnectFour/Board.js'
import useBoard from '../Hooks/useBoard.js';

const { Header, Footer, Content } = Layout;
const ConnectFour = (props) => {
    
    const {board, gameOver, turn, setMyRoom, setTurn, putChess, restart} = useBoard()
    const [playerOne, setPlayerOne] = useState({})
    const [playerTwo, setPlayerTwo] = useState({})
    useEffect(()=>{
        const trueplayers = props.player.filter((e)=>{
            return e.roomId === props.roomId;
        });
        if(trueplayers[0]){
            setPlayerOne(()=>trueplayers[0])
        }
        else{
            setPlayerOne(undefined)
        }
        if(trueplayers[1]){
            setPlayerTwo(()=>trueplayers[1])
        }
        else{
            setPlayerTwo(undefined)
        }
        if(playerOne && props.me===playerOne.name) setTurn(true)
        else setTurn(false)
    },[props.player, props.roomId, props.me])

    useEffect(()=>{
        if(props.status.type === 'Full'){
            props.setIsConnectFour(false)
            props.displayStatus(props.status)
            props.setStatus({})
        }
    },[props.status])

    useEffect(()=>{
        setMyRoom(props.roomId)
    })

    const play = (c) => {
        putChess({roomId: props.roomId, name: props.me, column: c})
    }

    return(
        <Layout>
            <Header className="site-layout-background2">
            <Button
            onClick={async()=>{
                const leaving = props.player.filter((e)=>{return e.name === props.me;})
                await props.leaveConnectFour(leaving[0])
                props.setIsConnectFour(false)
            }}
            > 
            Go Back!
            </Button>
            Connect Four!
            
            </Header>
            <Content>
                <div style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div>
                        <h1> Player 1: {playerOne? playerOne.name:'Waiting...'}</h1>
                        <Image height={200} src={playerOne? playerOne.pictureURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE95qPiotkOo4A7GdJm_bDsIZtT0BQxqmwTg&usqp=CAU"}/>
                    </div>
                    <div style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
                        {gameOver===0 ? !turn? <h1> Your Turn!</h1>: <h1>Oppnent's Turn!</h1>:<h1>Game Over!</h1>}
                        {(playerOne && playerTwo)
                        ?<Board board={board} play={play} gameOver={gameOver} turn={turn}></Board>
                        :<div></div>
                        }
                        {
                            gameOver === 1 && <h1> Red Team Wins!</h1>
                        }
                        {
                            gameOver === 2 && <h1> Yellow Team Wins!</h1>
                        }
                        {
                            (playerOne && playerTwo && gameOver)
                            ?<Button 
                                onClick={async()=>{
                                    restart({roomId: props.roomId})
                                }}
                            >
                                Restart?
                            </Button>
                            :<></>
                        }
                    </div>
                    <div>
                        <h1> Player 2: {playerTwo? playerTwo.name:'Waiting...'}</h1>
                        <Image height={200} src={playerTwo? playerTwo.pictureURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE95qPiotkOo4A7GdJm_bDsIZtT0BQxqmwTg&usqp=CAU"}/>
                    </div>
                </div>
            </Content>
            <Footer>
            Instruction <br></br>
            1. First, decide who goes first and what color each player will have. <br></br>
            2. Players must alternate turns, and only one disc can be dropped in each turn. <br></br>
            3. On your turn, drop one of your colored discs from the top into any of the seven slots. <br></br>
            4. The game ends when there is a 4-in-a-row or a stalemate. <br></br>
            5. The starter of the previous game goes second on the next game.
            </Footer>
        </Layout>
    )
}

export default ConnectFour