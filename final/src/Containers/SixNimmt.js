import { Layout, Button, Menu } from "antd"
import { useRef } from "react"
import "../Components/SixNimmt/sixNimmt.css"
import Player from "../Components/SixNimmt/Player.js"

const { Header, Content } = Layout;

const SixNimmt = ({setIsSixNimmt, me, sendLicensingCard,
                   isgamestart, setIsgamestart, selfCards,
                   cards, sendCompare, players, penaltyList,
                   gameOver, setGameOver, winner, photos, 
                   chosenList, roomname, sendLeaveRoom,}) => {
    const chosencardRef = useRef(0);
    //const roomname = "test";
    const gamestart = async () => {
        console.log("sixnimmt game initialization starts");
        setIsgamestart(true);                                                       // game start
        console.log(players)
        if (players[0] === me) {                                                  // if I am the host
            sendLicensingCard({room: roomname, number: players.length, six_players: players});
            console.log(roomname);                                                // send license card req
        }
    }
    const handleonclick = async (item, index) => {
        chosencardRef.current = item;
        sendCompare({player: me, card: chosencardRef.current, number: players.length, room: roomname});
        //console.log(index);
        setTimeout(function(){
            document.getElementsByClassName('SingleCard_in_MyHand_clicked')[0].className = 'SingleCard_in_MyHand';
        },50);       
        setTimeout(function(){
            document.getElementsByClassName('SingleCard_in_MyHand')[index].className = 'SingleCard_in_MyHand_clicked';
        },80);
    }
    
    const handleGoBack = () => {
        setIsSixNimmt(false);
        setIsgamestart(false);
        sendLeaveRoom({roomname, me});
    }
    
    const restartGame = async () => {
        setGameOver(false);
        setIsgamestart(false);
        alert("Please wait for the host to restart the game.");
    }
    
    const backToHome = () => {
        setGameOver(false);
        setIsSixNimmt(false);
        sendLeaveRoom({roomname, me});
    }
    const findcardcolor = (item) => {
        var penalty = 0;
        var Id ='';
        if(item === null) Id = "Space";
        else if (item % 10 === 0)  penalty += 3;
        else if (item === 55)      penalty += 7;
        else if (item % 11 === 0)  penalty += 5;
        else if (item % 5 === 0)   penalty += 2;
        else  penalty += 1;
        if (penalty === 1)     Id = 'WhiteCard';
        else if(penalty === 2) Id = 'BlueCard';
        else if(penalty === 3) Id = 'YellowCard';
        else if(penalty === 5) Id = 'RedCard';
        else if(penalty === 7) Id = 'PurpleCard';
        return Id;
    }

    return (
        <Layout>
            <Header>
                <Menu theme="dark" mode="horizontal" >
                    SixNimmt!
                    <div className="GoBack"> 
                        {<Button onClick={() => handleGoBack()}>
                            Go Back!
                        </Button>}
                    </div>
                </Menu>
            </Header>

            <Content>
                <>
                {gameOver ? 
                    <div className = 'modal'>
                        <div className = 'modalWrapper'>
                            <div className = 'modalContent'>
                                {winner === me ? <div className = 'modalResult'>CONGRADULATIONS! YOU WIN</div> : <div className = 'modalResult'>SO SAD, {winner} IS THE WINNER</div>}
                                <div className='modalBtnWrapper'>

                                    <div className = 'modalBtn' onClick = {() => restartGame()}>New Game</div>
                                    <div className = 'modalBtn' onClick = {() => backToHome()}>Back to Home</div>
                                </div>
                            </div>
                        </div>
                    </div>
                : <> </>
                }
                </>

            {isgamestart ? (
                <>
                <div className="MyHand">
                    <h3>{me}'s hand:</h3>
                    <div className="Self">
                        {selfCards.map((item, index) => {
                            var Id = findcardcolor(item);
                            return (<div className = "SingleCard_in_MyHand" id = {Id} onClick = {() => handleonclick(item, index)}>
                                <div className = {Id + 'Number'}>{item}</div>
                            </div>)
                        })}
                    </div>
                </div>
                    
                <div className="CardsArea">
                    {cards.map((singleRow, index1) => {
                        const Id = 'row'+index1.toString();
                        return (
                            <div className="CardsRow" key = {index1} id = {Id}>
                                {singleRow.map((item) => {
                                    var Id = findcardcolor(item);
                                    return (
                                        <div className="SingleCard_in_CardsArea" id = {Id}>
                                            <div className = {Id + 'Number'}> {item} </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <div className="PlayerSeats">
                    {players.map((item, index1) => {
                        return <Player name = {item} key = {index1} penalty = {penaltyList[index1]} photo = {photos[index1]} chosenList = {chosenList[index1]} />
                    })}
                </div>
                </>) : 
                <>
                    <img id = "LobbyRoom" alt = "lobby_room" src={[require("../Components/SixNimmt/LOBBY_ROOM.png")]} width = "500" ></img>
                    {players.map((item, index) => {
                            return (<div className="PlayersBoard"><h2>player {index + 1} {item}</h2></div>
                            )
                    })}
                    <br></br>
                </>
                }
            </Content>

            <div className="Footer">
            <strong>Instruction</strong> <br></br>
            There are 104 cards numbered from 1 to 104. Every card has 1 to 7 small bull head on it, which will score against you.<br></br>
            A round of ten turns is played where all players place one card of their choice onto the table.<br></br>
            At each turn, each player selects a card to play, and puts the card face down on the table. When all the players have selected a card, the cards are uncovered.<br></br>
            Starting with the lowest valued card, and continuing in increasing order, each player must put their card at the end of one of the four rows on the table, following these rules:<br></br><br></br>

            <li>The card must be put on a row where the latest (end) card is lower in value than the card that is about to be played.</li>
            <li>The card must be put on the row where the latest (end) card is the closest in value to the card that is about to be played (if your card is 33, then place it next to the 30 not the 29, for example)</li>
            <li>If the row where the played card must be placed already contains 5 cards (the player's card is the 6th), the player must gather the 5 cards on the table, leaving only the 6th card in their place to start a new row.</li>
            <li>The gathered cards must be taken separated and never mixed with the hand cards. The sum of the number of cattle head on the gathered cards will be calculated at the end of the round.</li>
            <li>If the played card is lower than all the latest cards present on the four rows, the player must choose a row and gather the cards on that row (usually the row with the fewest cattle heads), leaving only the played card on the row.</li>
            <li>The cards of all the players are played following these rules, from the lowest player card to the highest one.</li><br></br>

            At the end of the turn, the players each select a new card to play; this is repeated for 10 turns until all the cards in the hand are played.<br></br>
            After the 10 turns, each player counts the cattle heads on the cards gathered from the table during the round. The score of each player is collected on the paper and a new hand starts.<br></br>
            The game ends when a player collects a total of 66 or more cattle heads. The winner is the player who has collected <strong>the fewest cattle heads</strong>.<br></br>
            </div>
            {isgamestart ? (
                <></>):
                <><div className="StartGame">
                {players[0] === me ? <Button onClick = {() => {console.log("DAFD");gamestart() }}>START GAME </Button> : <></>}
                </div></>
            }
        </Layout>
    )
}

export default SixNimmt;