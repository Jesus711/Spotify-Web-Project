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
