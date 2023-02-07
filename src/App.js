import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import ColorButtons from './components/Button';
import io from 'socket.io-client';
import Play from './components/Play';
const socket = io('http://localhost:3000/');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [list, setList] = useState([])
  const [time, setTime] = useState(0)
  const [status, setStatus] = useState('PENDING')
  const [counter, setCounter] = useState(0)
  const [balance, setBalance] = useState(0)
  const [valueBet, setValueBet] = useState(0)

  useEffect(() => {
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
      console.log(data)
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

    socket.on('SET_BALANCE', (data) => {
      setBalance(data);
    });

    const getBalance = () => {
      socket.emit('GET_BALANCE')
    }
    getBalance()
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const handleClickStop = () => {
    socket.emit('STOP', counter);
  }

  const handleClickBet = (value) => {
    socket.emit('BET', value);
  }
  return (
    <div>
      <p>Connected: {'' + isConnected + '__ ' + socket.id + ' '} </p>
      <p>Your Balance: {balance}$ </p>
      <p>{valueBet > 0 ? `Your bet: ${valueBet}$` : ''}</p>
      <Play content='Stop' counter={counter} status={status} handleClickStop={handleClickStop} time={time} handleClickBet={handleClickBet} setValueBet={setValueBet} setBalance={setBalance} valueBet={valueBet}></Play>
    </div>
  );
}

export default App;


