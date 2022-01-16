import { Modal, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useEffect, useState } from "react";

const SignInModal = ({ visible, onCreate, onCancel }) => {
  const [temp,setTemp] = useState("")
  const [password,setPassword] = useState("")
  const [isAble, setIsAble] = useState(false)
  useEffect(()=>{
    setIsAble(temp!==''&& password!=='')
  },[temp, password])

  return (
    <Modal
      visible={visible}
      title="Create An Account!"
      okText="Sign Up"
      cancelText="Cancel"
      onCancel={() => {
        onCancel();
        setTemp('')
        setPassword('')
     }}
      onOk={() => {
         onCreate(temp, password);
         setTemp('')
         setPassword('')
      }}
      okButtonProps={{ disabled: !isAble }}
    >
        <Input
          prefix={<UserOutlined />}
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          placeholder="Enter your name"
          size="large" style={{ width: 300, margin: 10}}
        />
        <Input.Password
          placeholder="Input password"
          value={password}
          onChange={(e) => {setPassword(e.target.value)}}
          size="large" style={{ width: 300, margin: 10}}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
    </Modal>
  );
};

export default SignInModal;
