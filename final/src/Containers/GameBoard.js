import { Button, Layout, Menu } from 'antd';
import { Card, Row, Col, Image, Modal, Input} from 'antd'
import { TagOutlined, UserOutlined, TrophyOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from '../api'; 
import ConnectFourModal from '../Components/ConnectFour/ConnectFourModal.js';
import SixNimmtModal from "../Components/SixNimmt/SixNimmtModal.js"
const { Header, Content, Sider } = Layout;
const { Meta } = Card  

const GameBoard = ({me, collapsed, toggle, setIsConnectFour, setIsSixNimmt,
                    photoURL, setPhotoURL, playConnectFour, players, sendCheckSixNimmtRoom}) =>{
    const[temp, setTemp] = useState('')  // used to record old photo
    const[photoModal, setPhotoModal] = useState(false)
    const[connectFourVisible, setConnectFourVisible] = useState(false)
    const [sixNimmtVisible, setSixNimmtVisible] = useState(false);

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
    
              <div className="logo">
                <Image
                  height={100}
                  src={photoURL}
                />
                <Button
                  onClick={()=>{
                    setPhotoModal(true)
                    setTemp('')
                  }}
                >
                  Change Your Photo Sticker
                </Button>
                <Modal
                visible = {photoModal}
                onOk={async()=>{
                  const {
                    data: { URL },
                  } = await axios.post('/api/create-photo', {
                    me,
                    newPhoto: temp
                  });
                  setPhotoURL(URL)
                  setPhotoModal(false)
                }}
                onCancel={()=>{
                  setPhotoModal(false)
                }}
                okText="Create"
                cancelText="Cancel"   
                >   
                    <h2>Choose Your Favorite Picture Online!</h2>
                    <Input
                        placeholder="Enter Picture's URL"
                        value = {temp}
                        onChange={(e) => setTemp(e.target.value)}
                    />
                </Modal>
              </div>
              <Menu theme="dark" mode="inline">
                <Menu.Item key="1" icon={<UserOutlined />}>
                  Personal Profile
                </Menu.Item>
                <Menu.Item key="2" icon={<TagOutlined />}>
                  Game Performance
                </Menu.Item>
                <Menu.Item key="3" icon={<TrophyOutlined />}>
                  Award
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0 }}>
                {collapsed 
                ? <MenuUnfoldOutlined className = 'trigger' onClick = {toggle} style={{ padding: 10 }}/>
                : <MenuFoldOutlined className = 'trigger' onClick = {toggle} style={{ padding: 10 }}/>
                }
                <div className = 'title'> {me}, Welcome To Board Game World! </div>
              </Header>
              <Content
                className="site-layout-background"
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 400,
                }}
              >
                <div className="site-card-wrapper">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt="example" src="https://m.media-amazon.com/images/I/81fEiLrmZ8L._AC_SL1500_.jpg" />}
                      onClick={() => setConnectFourVisible(true)}
                      >
                        <Meta title="Connect 4" description="Easy and fun. Recommended to beginners. " />
                      </Card>
                      <ConnectFourModal
                          visible={connectFourVisible}
                          onCreate={async(name) => {
                            await playConnectFour({roomId: name, player: me})
                            setConnectFourVisible(false);
                            setIsConnectFour(true)
                          }}
                          onCancel={() => {
                            setConnectFourVisible(false);
                            setIsConnectFour(false)
                          }}
                        />
                    </Col>
                    <Col span={8}>
                      <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt="example" src="https://play-lh.googleusercontent.com/p11kV_h4I96S7LT-c_oZAs278HzGISfib30JvMVFzN7FzUCJfU9JnX8dzC5VMUy1cs8" />}
                      >
                        <Meta title="MineSweeper" description="Easy and fun. Recommended to beginners. " />
                      </Card>
                    </Col>
                    <Col span={8}>
                    <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt="example" src="https://www.gamesworld.com.au/wp-content/uploads/2020/04/6nimmt.jpg" />}
                      onClick={() => setSixNimmtVisible(true)}
                      >
                        <Meta title="6 Nimmt" description="Very Exciting. Recommended to advanced players. " />
                      </Card>
                      <SixNimmtModal
                          visible = {sixNimmtVisible}
                          onCreate = {(roomname) => sendCheckSixNimmtRoom({roomname, me})}
                          onCancel={() => {
                            setSixNimmtVisible(false);
                            setIsSixNimmt(false)
                          }}
                        />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt="example" src="https://play-lh.googleusercontent.com/Fb5Q1xM1X8HGSk0jcl_mjQdw5jKCL29g-2rzThfhii9De9-5lwrdjCsnFrgtTJ6OGJmH" />}
                      >
                        <Meta title="Hanafuda" description="Easy and fun. Recommended to beginners. " />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Content>
            </Layout>
          </Layout>
      );
}

export default GameBoard