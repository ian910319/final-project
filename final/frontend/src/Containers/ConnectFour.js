import { Layout, Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import Board from '../Components/ConnectFour/Board'
import { deepCloneBoard } from '../Components/ConnectFour/utility'

const { Header, Footer, Content } = Layout;
const ConnectFour = (props) => {
    const [board, setBoard] = useState([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ]);
    const [turn, setTurn] = useState(true)
    const [playerOne, setPlayerOne] = useState({})
    const [playerTwo, setPlayerTwo] = useState({})
    useEffect(()=>{
        const trueplayers = props.player.filter((e)=>{
            console.log(e.roomId)
            return e.roomId === props.roomId;
        });
        if(trueplayers[0]){
            setPlayerOne(()=>trueplayers[0])
        }
        if(trueplayers[1]){
            setPlayerTwo(()=>trueplayers[1])
        }
        console.log(trueplayers)
    },[props.player, props.roomId])

    return(
        <Layout>
            <Header className="site-layout-background">
            <Button
            onClick={async()=>{
                const leaving = props.player.filter((e)=>{return e.name === props.me;})
                console.log(leaving)
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
                        <h1> Player 1: {playerOne? playerOne.name:''}</h1>
                        <Image height={200} src={playerOne? playerOne.pictureURL:''}/>
                    </div>
                    <div style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
                        <h1> Player 1's turn </h1>
                        {(playerOne.name && playerTwo.name)
                        ?<Board board={board} setBoard={setBoard}></Board>
                        :<div></div>
                        }
                    </div>
                    <div>
                        <h1> Player 2: {playerTwo? playerTwo.name:''}</h1>
                        <Image height={200} src={playerTwo? playerTwo.pictureURL:''}/>
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