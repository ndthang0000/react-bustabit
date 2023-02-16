import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import ColorButtons from './components/Button';
import io from 'socket.io-client';
import Play from './components/Play';
import Login from './components/Login';
//const socket = io('https://server-game.autokingtrade.com/', { query: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE2MDI4OSwiaWF0IjoxNjc2NTM5MTQzLCJleHAiOjE2NzY1NjA3NDMsInR5cGUiOiJhY2Nlc3MifQ.iWGtYNsRPgysFmJhWM_RriQLEI6LX87-WLt8yEkyknk" });

function App() {
  const [socket, setSocketIo] = useState(null)
  const [token, setToken] = useState(null)
  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState(null);
  const [list, setList] = useState([])
  const [time, setTime] = useState(0)
  const [status, setStatus] = useState('PENDING')
  const [counter, setCounter] = useState(0)
  const [balance, setBalance] = useState(0)
  const [valueBet, setValueBet] = useState(0)

  useEffect(() => {

    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('pong', () => {
        setLastPong(new Date().toISOString());
      });

      socket.on('COUNT_DOWN', (data) => {
        setTime(data);
      });

      socket.on('CHANGE_STATUS', (data) => {
        setStatus(data);
        if (data == 'END') {
          setValueBet(0)
        }
      });

      socket.on('GET_LIST_ONLINE', (data) => {
        setList(data);
      });

      socket.on('COUNTER', (data) => {
        setCounter(data);
      });

      socket.emit('FETCH_STATUS')

      socket.on('GET_BALANCE', (data) => {
        console.log('new balance', data);
        setBalance(data)
      });

      socket.on('SET_BALANCE', (data) => {
        setBalance(data);
      });

      socket.on('MESSAGE', (data) => {
        console.log(data)
      });

      const getBalance = () => {
        socket.emit('FETCH_BALANCE')
      }
      getBalance()
    }






    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
      }

    };
  }, [token]);

  const handleClickStop = () => {
    socket.emit('STOP', counter);
  }

  const handleClickBet = (value) => {
    socket.emit('BET', { currency: 'HBG', amountBet: value });
  }

  const handleSetToken = (token) => {
    setToken(token)
    setSocketIo(io('https://server-game.autokingtrade.com/', { query: `token=${token}` }))
  }
  return (
    <div>
      {
        !token ?
          <Login setToken={handleSetToken} /> :
          <>
            <p>Connected: {'' + isConnected + '__ ' + socket.id + ' '} </p>
            <p>Your Balance: {balance}$ </p>
            <p>{valueBet > 0 ? `Your bet: ${valueBet}$` : ''}</p>
            <Play content='Stop' counter={counter} status={status} handleClickStop={handleClickStop} time={time} handleClickBet={handleClickBet} setValueBet={setValueBet} setBalance={setBalance} valueBet={valueBet}></Play>
            <div style={{
              marginTop: 50
            }}>

              {list.length > 0 ? list.map((item, index) => <li key={index} style={{ color: item.status == 'WIN' ? 'green' : 'red' }}>Amount: {item.amountBet}, status: {item.status}, {item.xMulti ? 'xWin: ' + item.xMulti : ''}</li>) : 'Chưa có ai bet'}
            </div>
          </>
      }

    </div>
  );
}

export default App;


