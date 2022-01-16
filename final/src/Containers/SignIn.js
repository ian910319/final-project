import { Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components"
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useState, useEffect } from "react";
import axios from '../api'; 
import Modal from '../Components/SignIn/SignInModal.js'
import { trim } from 'lodash'

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
  
    h1 {
    color:bisque;
    margin: 0;
    margin-right: 20px;
    font-size: 5em;
}`;

const Wrapper = styled.div`
  background-image: url(https://i.stack.imgur.com/p9mUO.jpg);
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: auto;
  margin: auto;
`
const SignIn = ({ me, setMe, setSignedIn, setPhotoURL, sendLogIn, displayStatus }) => {
  const [Password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)

  return(
    <Wrapper>
      <Title>
        <h1>The Entrance of Board Game World...</h1>
      </Title>
      <Input
        prefix={<UserOutlined />}
        value={me}
        onChange={(e) => setMe(e.target.value)}
        placeholder="Enter your name"
        size="large" style={{ width: 300, margin: 10}}
      />
      <Input.Password
        placeholder="Input password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        size="large" style={{ width: 300, margin: 10}}
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
        <Button
          onClick={
            

            async() => {
              const {data: { payload, login, photoURL }} = await axios.get('/api/find-user', {params: { me, password: Password }});
              if(login) {
                setPhotoURL(photoURL)
                setSignedIn(true)
                displayStatus({type: payload.status, msg: payload.msg})
                sendLogIn({user: me})
              }
              else{
                setSignedIn(false)
                setPassword('')
                displayStatus({type: payload.status, msg: payload.msg})
              }
            }
          }
          disabled={(!Password) || (!me)}
        >
          Sign In!
        </Button>
        <div style={{height:"10px"}}></div>
        <Button 
          onClick={()=>{
          setVisible(true)
        }}>
          Do Not Have An Account?
        </Button>
      <Modal
        visible = {visible}
        onCreate={async(me, password)=>{
          const {data: { payload }} = await axios.post('/api/create-user', { me, password });
          displayStatus({type: payload.status, msg: payload.msg})
          setVisible(false)
        }}
        onCancel={()=>{
          setVisible(false)
        }}
      />
    </Wrapper>
  );
}
export default SignIn;
