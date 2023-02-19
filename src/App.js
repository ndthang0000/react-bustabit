import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import ColorButtons from './components/Button';
import io from 'socket.io-client';
import Play from './components/Play';
import Login from './components/Login';
import ChartLine from './components/chart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ListBet from './components/ListBet';
import { Button } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ResponsiveAppBar from './components/AppBar';
//const socket = io('https://server-game.autokingtrade.com/', { query: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE2MDI4OSwiaWF0IjoxNjc2NTM5MTQzLCJleHAiOjE2NzY1NjA3NDMsInR5cGUiOiJhY2Nlc3MifQ.iWGtYNsRPgysFmJhWM_RriQLEI6LX87-WLt8yEkyknk" });

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 3
}));

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
  const [chartData, setChartData] = useState([])

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
          setChartData([])
        }
      });

      socket.on('GET_LIST_ONLINE', (data) => {
        setList(data);
      });

      socket.on('COUNTER', (data) => {
        setCounter(data);
        chartData.push({ name: 'time', pv: Number(data) })
        setChartData([...chartData])
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

  useEffect(() => {
    const getLocalStore = localStorage.getItem('token')
    setToken(getLocalStore)
    setSocketIo(io('https://server-game.autokingtrade.com/', { query: `token=${getLocalStore}` }))
  }, [])
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
    <div style={{
      marginTop: 30
    }}>
      {/* <ResponsiveAppBar /> */}
      {
        !token ?
          <Login setToken={handleSetToken} /> :
          <>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <ChartLine data={chartData}>
                  </ChartLine>
                </Grid>
                <Grid item xs={3}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Button variant="outlined" startIcon={<CurrencyExchangeIcon />}>
                      Your Balance: {Number(balance).toFixed(4)}$
                    </Button>
                    <p>{valueBet > 0 ? `Your bet: ${valueBet}$` : ''}</p>
                    <Play content='Stop' counter={counter} status={status} handleClickStop={handleClickStop} time={time} handleClickBet={handleClickBet} setValueBet={setValueBet} setBalance={setBalance} valueBet={valueBet}></Play>
                  </Paper>

                </Grid>
                <Grid item xs={5}>
                  {/* <div style={{
              marginTop: 50
            }}>
              {list.length > 0 ? list.map((item, index) => <li key={index} style={{ color: item.status == 'WIN' ? 'green' : 'red' }}>Amount: {item.amountBet}, status: {item.status}, {item.xMulti ? 'xWin: ' + item.xMulti : ''}</li>) : 'Chưa có ai bet'}
            </div> */}
                  <ListBet list={list} />
                </Grid>
              </Grid>
            </Box>

          </>

      }
    </div>
  );
}

export default App;


