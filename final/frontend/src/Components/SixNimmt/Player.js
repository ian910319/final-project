import styled from "styled-components";
import "./sixNimmt.css"

const PlayerBackground = styled.div`
    width: 15%;
    float: left;
    margin: 10px;
    color: aliceblue;
`;

const Player = ({name, penalty, photo, chosenList}) => {
    return (
        <PlayerBackground>
            <strong> {name} </strong><br></br>
            <img alt = " " src = {photo} width = "90" height = "50" ></img><br></br>
            <p> penalty {penalty}</p>
            
            <div alt = " " src = {[require("./backside.png")]} width = "80" height = "auto">{chosenList}</div>
        </PlayerBackground>


    )
}

export default Player;