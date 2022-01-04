import { Layout, Button } from "antd"
import { useState } from "react"
import styled from "styled-components"
import Player from "../Components/SixNimmt/Player"

const { Header, Content, Footer } = Layout;


const PlayerSeats = styled.div`
    width: 100%;
    height: 200px;
    background-color: #ffff;
`

const CardsArea = styled.div`
    width: 100%;
    height: 400px;
    background-color: #abcd;
`;

const SingleCard = styled.div`
    width: 50px;
    height: 50px;
    background-color: #eeee;
    margin: 10px;
    float: left;
`;

const Self = styled.div`
    width: 1000px;
    height: 300px;
    background-color: #dddd;
`;

const CardRow = styled.div`
    width: 100%;
    height: 70px;
`;

const SixNimmt = ({setIsSixNimmt}) => {
    const [players, setPlayers] = useState(["Tim", "Jack", "Andy", "Kathy", "Cindy"]);
    const [cards, setCards] = useState([
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]);

    return (
        <Layout>
            <Header>
                <Button onClick={() => setIsSixNimmt(false)}>
                    Go Back!
                </Button>
                SixNimmt!
            </Header>

            <Content>
                <PlayerSeats>
                    {players.map((item, index1) => {
                        console.log(item, index1);
                        return <Player name = {item} key = {index1}/>
                    })}
                </PlayerSeats>
                <CardsArea>
                    {cards.map((singleRow, index1) => {
                        const Id = 'row'+index1.toString();
                        return (
                            <CardRow key = {index1} id = {Id}>
                                {singleRow.map(() => {
                                    return (
                                        <SingleCard />
                                    )
                                })}
                            </CardRow>
                        )
                    })}
                </CardsArea>
                <Self>
                </Self>
            </Content>

            <Footer>
            Instruction <br></br>
            </Footer>
        </Layout>
    )
}

export default SixNimmt;