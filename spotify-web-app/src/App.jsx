import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Collab from './components/Collab';
import spotify_img from '../src/assets/spotify-look-logo.png'
import Search from './components/Search';
import Artist from './components/Artist'
import Album from './components/Album';

function App() {

  async function getRefreshToken(token) {
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const client_secret = import.meta.env.VITE_CLIENT_SECRET;
    const TOKEN = "https://accounts.spotify.com/api/token"

    let result = await fetch(TOKEN, 
        {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body: `grant_type=refresh_token&refresh_token=${token}`
        }).then(res => {
            return res.json()
        }).then(data => {
          return data
        })
    console.log(result)  

    window.sessionStorage.setItem('refresh-token', result.access_token);

    return result.access_token;
  }



  return (
    <div className="App">
      <div className="App-title">
        <div className='container'>
            <div className='logo-border'></div>
            <img  className='logo-img'  src={spotify_img} alt="" />
        </div>
        <a href='/'>SpotifyCollab</a>
      </div>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/playlist' element={<Playlist/>}></Route>
        <Route path='/collab' element={<Collab/>}></Route>
        <Route path='/playlist/search' element={<Search/>}></Route>
        <Route path='/playlist/search/artist/:name/:uri' element={<Artist/>}></Route>
        <Route path='/playlist/search/artist/album' element={<Album/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
