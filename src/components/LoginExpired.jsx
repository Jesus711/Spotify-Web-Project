import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginExpired() {

    const navigate = useNavigate()
    const base = import.meta.env.DEV ? '/' : '/Spotify-Web-Project'

  return (
    <div className='expired-logged'>
        <div>You May Have Not Logged In Or Your Login Has Expired</div>
        <div>Must Re-Login to continue</div>
        <button className="option-btn" onClick={() => navigate(base)}>Go to Login Page</button>
    </div>
  )
}
