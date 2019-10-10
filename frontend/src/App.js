import React from "react";
import "./App.css";
import MyWebsocket from "./websocket";

class App extends React.Component {
  state = {
    connected: false,
    transactions: []
  };

  componentDidMount() {
    this.websocket = new MyWebsocket(this.addTransaction);
    this.setState({ connected: true });
  }

  closeConnection = () => {
    this.setState({ connected: false });
    this.websocket.closeConnection();
  };

  addTransaction = tx => {
    // console.log(tx);
    const { transactions } = this.state;
    const sliceTxs = transactions.length > 20;
    const outputs = tx.x.out;
    const time = tx.x.time;
    let totalTx = 0;
    for (let j = 0; j < outputs.length; j++) {
      totalTx += outputs[j].value;
    }
    totalTx /= 100000000;
    this.setState({
      transactions: [
        ...(sliceTxs ? transactions.slice(1) : transactions),
        { totalTx: totalTx, time: time }
      ]
    });
  };

  parseTime = t => {
    const date = new Date(t * 1000);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  renderTxs = () => {
    return this.state.transactions.map(tx => (
      <li key={this.state.transactions.indexOf(tx)}>
        <p>{tx.totalTx}</p>
        <p>{this.parseTime(tx.time)}</p>
      </li>
    ));
  };

  render() {
    return (
      <>
        <header>
          <h1>
            <span>Bitcoin</span> Dashboard
          </h1>
          <h2>Bitcoin transaction stream viewer</h2>
        </header>
        <main className="app">
          <div></div>
          <p>
            {this.state.connected
              ? " streaming live transactions"
              : " stream stopped"}
          </p>
          <button onClick={this.closeConnection}>Close Socket</button>
          <div className="tx-panel">
            <ul>
              <li>
                <p>BTCs</p>
                <p>UTC Time</p>
              </li>
              {this.renderTxs()}
            </ul>
          </div>
        </main>
      </>
    );
  }
}

export default App;
