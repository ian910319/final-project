import { Layout, Button } from 'antd';
import { useState } from 'react';
import Board from '../Components/ConnectFour/Board'

const { Header, Footer, Content } = Layout;
const ConnectFour = (props) => {
    const [board, setBoard] = useState([
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ]);

    return(
        <Layout>
            <Header className="site-layout-background">
            <Button
            onClick={()=>props.setIsConnectFour(false)}
            >
            Go Back!
            </Button>
            Connect Four!
            
            </Header>
            <Content>
                <Board board={board} setBoard={setBoard}></Board>
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