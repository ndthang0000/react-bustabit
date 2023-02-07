import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ButtonBet({ content, handleClickBet }) {
  return (
    <Button variant="contained" color="success" onClick={handleClickBet}>
      {content}
    </Button>
  );
}