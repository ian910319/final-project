import styled from "styled-components";
import "./sixNimmt.css"

const PlayerBackground = styled.div`
    width: 10%;
    float: left;
    margin: 10px;
`;

const Player = ({name}) => {


    return (
        <PlayerBackground>
            <img alt = "example" src="http://3.bp.blogspot.com/-1HBwDwlj63I/TcJuwSp7FkI/AAAAAAAAAO0/0__Eeio4OVo/s1600/750px-Anonymous_Flag_svg.png" width = "90" height = "50"></img>
            <p> {name} </p>
            <img alt = "example" src = "https://gleamplay.com/img/6nimmt.jpg?v=1.38" width = "50" height = "50"></img>
            <p> penalty cards have</p>
        </PlayerBackground>


    )
}

export default Player;