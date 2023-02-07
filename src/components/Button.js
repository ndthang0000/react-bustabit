import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ColorButtons({ content, handleClickStop, valueBet, setIsStop }) {
  return (
    <Button variant="contained" color="success" onClick={(e) => { setIsStop(true); handleClickStop(e); }}>
      {content}
    </Button>
  );
}