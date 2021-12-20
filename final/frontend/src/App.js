import { Layout, Menu } from 'antd';
import { TagOutlined, UserOutlined, TrophyOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import "./App.css"
import { useState} from 'react';

const { Header, Content, Sider } = Layout;

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => {
    const now = !collapsed
    setCollapsed(now)
  };

  return (
    <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>

          <div className="logo" />
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
          <Header className="site-layout-background" style={{ padding: 0 }}
          title="Welcome to Board Game World!"
          >
            {collapsed 
            ? <MenuUnfoldOutlined className = 'trigger' onClick = {toggle} />
            : <MenuFoldOutlined className = 'trigger' onClick = {toggle} />
            }
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 400,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
  );
}

export default App;
