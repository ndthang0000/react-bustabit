import { Button } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import DOMAIN from '../domain'

export default function Login({ setToken }) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin = async () => {
    // const data = await fetch('https://server-game.autokingtrade.com/api/auth/login', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: { email: userName, password } })
    // console.log(data)
    const data = await axios.post(`${DOMAIN}api/auth/login`, { email: userName, password })
    if (data.status == 200) {
      setToken(data.data.data.tokens.access.token)
      localStorage.setItem('token', data.data.data.tokens.access.token)
    }
  }

  return (
    <div style={{
      margin: 40
    }}>
      <form>
        <label >Username:</label><br />
        <input type='text' placeholder='UserName' value={userName} onChange={(e) => setUserName(e.target.value)
        } style={{ marginBottom: 20 }}>
        </input>
        <br />
        <label >Password:</label><br />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} >
        </input>
        <br />
        <Button variant="contained" color="success" style={{
          margin: 40
        }} onClick={handleLogin}>
          LOGIN
        </Button>
      </form>
    </div>
  )
}
