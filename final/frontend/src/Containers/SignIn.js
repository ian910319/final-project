import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components"
import axios from '../api'; 

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
  
    h1 {
    margin: 0;
    margin-right: 20px;
    font-size: 3em;
}`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 800px;
  margin: auto;
`
const SignIn = ({ me, setMe, setSignedIn, setPhotoURL }) => (
  <Wrapper>
    <Title>
      <h1>The Entrance of Board Game World...</h1>
    </Title>
    <Input.Search
      prefix={<UserOutlined />}
      value={me} enterButton="Enter!"
      onChange={(e) => setMe(e.target.value)}
      placeholder="Enter your name"
      size="large" style={{ width: 300, margin: 50}}
      onSearch={async() => {
        setSignedIn(true);
        const {
          data: { URL },
        } = await axios.post('/api/create-user', {
          me
        });
        console.log(URL)
        setPhotoURL(URL)
      }}
    />
  </Wrapper>
);

export default SignIn;