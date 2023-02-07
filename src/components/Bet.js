import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ButtonBet from './ButtonBet';

export default function BasicTextFields({ handleClickBet, setValueBet }) {
  const [value, setValue] = React.useState(0)
  const [isBet, setIsBet] = React.useState(false)
  const handleOnChangeBet = (e) => {
    if (!Number.isNaN(e.target.value)) {
      setValue(e.target.value)
    }

  }
  const handleClick = () => {
    handleClickBet(value)
    setIsBet(true)
    setValueBet(value)
  }
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"

    >
      <TextField id="outlined-basic" label="0" variant="outlined" value={value} onChange={handleOnChangeBet} />
      {!isBet ? <ButtonBet content='Bet' handleClickBet={handleClick} /> : <div>Your Bet: {value}</div>}
    </Box>
  );
}