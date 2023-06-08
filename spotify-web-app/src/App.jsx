import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Collab from './components/Collab';


function App() {


  return (
    <div className="App">
      <div className="App-title"><a href='.'>SpotifyCollab</a></div>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/playlist' element={<Playlist/>}></Route>
        <Route path='/collab' element={<Collab/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
