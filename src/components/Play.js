import { useEffect, useState } from 'react';
import BasicTextFields from './Bet';
import ColorButtons from './Button'
import { Alert, CircularProgress, LinearProgress, Typography } from '@mui/material';
import '@fontsource/roboto/500.css';
import { styled } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

export default function Play({ content, counter, status, handleClickStop, time, handleClickBet, setValueBet, valueBet }) {
  const [isStop, setIsStop] = useState(false)
  const [winValue, setWinValue] = useState(0)
  useEffect(() => {
    setWinValue(counter * valueBet)
  }, [isStop])
  useEffect(() => {
    if (status == 'START') {
      setIsStop(false)
    }
  }, [status])
  return (
    <>
      <Alert severity="info">Status: {status}</Alert>
      {
        status == 'START'
          ?

          <div>
            {!isStop ? <div style={{
              fontWeight: 'bold',
              marginRight: 5
            }}>Counter : {counter}%
              <ColorButtons content={content} handleClickStop={handleClickStop} setIsStop={setIsStop} /></div> : <p>You win: {winValue} Counter: {counter}</p>}

          </div>

          :
          <p></p>

      }
      {
        status == 'END'
          ?
          <Div>
            <Alert severity="error">BUSTED = {counter}</Alert>
          </Div>

          :
          <p></p>

      }
      {
        status == 'PENDING'
          ?
          <Div>
            <LinearProgress color="success" />
            <p mt={1}>Start After = {time}s</p>
            <BasicTextFields handleClickBet={handleClickBet} setValueBet={setValueBet}></BasicTextFields>
          </Div>

          :
          <p></p>

      }


    </>
  );
}