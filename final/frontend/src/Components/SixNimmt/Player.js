import styled from "styled-components";
import "../../Containers/sixNimmt.css"

const PlayerBackground = styled.div`
    width: 15%;
    float: left;
    margin: 10px;
    color: aliceblue;
`;
const findcardcolor = (item) => {
    var penalty = 0;
    var Id ='';
    if(item === null || 0) Id = "Space";
    else if(item === 105) Id = "BackSide";
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
const Player = ({name, penalty, photo, chosenList}) => {
    return (
        <PlayerBackground>
            <p> {name} </p><br></br>
            <img alt = " " src = {photo} width = "90" height = "50" ></img><br></br>
            <p> penalty {penalty}</p>
            {chosenList === 0 ? <></> : 
                    <div className = "SingleCard_in_MyHand" id = {findcardcolor(chosenList)}>
                        <div className = {findcardcolor(chosenList)+ 'Number'} style = {{opacity: (chosenList===105)?"0":"1"}}>{chosenList} </div>
                    </div>
            }
            
            
            <div></div>
        </PlayerBackground>


    )
}

export default Player;