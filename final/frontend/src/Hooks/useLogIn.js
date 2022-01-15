const client = new WebSocket('ws://localhost:4000')

const sendData = async (data) => {
    await client.send(
      JSON.stringify(data)
    );  
  }

const useLogIn = () => {
    const sendLogIn = (payload) => {
        sendData(["login", payload]);
    }
    return {sendLogIn};
};

export default useLogIn;