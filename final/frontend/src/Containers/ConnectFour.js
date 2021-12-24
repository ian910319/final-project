import { Layout, Button } from 'antd';

const { Header, Footer, Content } = Layout;
const ConnectFour = (props) => {
    return(
        <Layout>
            <Header className="site-layout-background">
            Connect Four!
            </Header>
            <Content>
            <Button
            onClick={()=>props.setIsConnectFour(false)}
            >
            Go Back!
            </Button>
            </Content>
            <Footer>
            Instruction
            </Footer>
        </Layout>
    )
}

export default ConnectFour