import { useEffect, useState } from 'react';
import BasicTextFields from './Bet';
import ColorButtons from './Button'

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
      <p>Status: {status}</p>
      {
        status == 'START'
          ?

          <div>
            {!isStop ? <div>Counter : {counter}%
              <ColorButtons content={content} handleClickStop={handleClickStop} setIsStop={setIsStop} /></div> : `You win: ${winValue}$\nCounter: ${counter}`}

          </div>

          :
          <p></p>

      }
      {
        status == 'END'
          ?
          <div>
            BUSTED = {counter}
          </div>

          :
          <p></p>

      }
      {
        status == 'PENDING'
          ?
          <div>
            Start After = {time}
            <BasicTextFields handleClickBet={handleClickBet} setValueBet={setValueBet}></BasicTextFields>
          </div>

          :
          <p></p>

      }


    </>
  );
}