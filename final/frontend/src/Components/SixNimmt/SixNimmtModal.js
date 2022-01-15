import { Modal, Input } from "antd";
import { useState } from "react";

const ConnectFourModal = ({ visible, onCreate, onCancel }) => {
  const [temp,setTemp] = useState("")
  return (
    <Modal
      visible={visible}
      title="Enter SixNimmt Room"
      okText="Go"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
         onCreate(temp);
      }}
    >
        <Input
            placeholder="Enter Room ID"
            value = {temp}
            onChange={(e) => setTemp(e.target.value)}
        />
    </Modal>
  );
};

export default ConnectFourModal;
