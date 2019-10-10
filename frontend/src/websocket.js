const wsUri = "wss://ws.blockchain.info/inv";

function MyWebsocket(onMsg) {
  const websocket = new WebSocket(wsUri);

  websocket.onopen = e => {
    console.log("CONNECTED");
    websocket.send('{"op":"unconfirmed_sub"}');
  };
  websocket.onclose = e => {
    console.log("DISCONNECTED");
  };
  websocket.onerror = e => {
    console.log("error:", e.data);
  };
  websocket.onmessage = e => {
    onMsg(JSON.parse(e.data));
  };

  this.closeConnection = () => {
    console.log("closing socket");
    websocket.close();
  };
}

export default MyWebsocket;
