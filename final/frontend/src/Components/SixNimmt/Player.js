import styled from "styled-components";
//import "./sixNimmt.css"

const PlayerBackground = styled.div`
    width: 15%;
    float: left;
    margin: 10px;
    opacity: 0.5;
    color: aliceblue;
`;

const Player = ({name, penalty}) => {
    return (
        <PlayerBackground>
            <strong> {name} </strong><br></br>
            <img alt = "example" src="http://3.bp.blogspot.com/-1HBwDwlj63I/TcJuwSp7FkI/AAAAAAAAAO0/0__Eeio4OVo/s1600/750px-Anonymous_Flag_svg.png" width = "90" height = "50" ></img><br></br>
            <p> penalty {penalty}</p>
            <img alt = "example" src = {[require("./backside.png")]} width = "80" height = "auto"></img>
        </PlayerBackground>


    )
}

export default Player;