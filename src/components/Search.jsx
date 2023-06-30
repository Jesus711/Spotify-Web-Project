import { Link, useLocation, useNavigate } from "react-router-dom";
import '../css/Search.css';
import PlaylistItem from "./PlaylistItem";
import playlist_image_holder from '../assets/Empty_Playlist.jpg';
import { useEffect, useState } from "react";
import avatar from '../assets/avatar.webp';
import LoginExpired from './LoginExpired';


function Search() {
    const [playlist, setPlaylist] = useState({});
    const [searched, setSearched] = useState("");
    const [searchResults, setSearchResults] = useState({});
    const [searchType, setSearchType] = useState("artist");
    const [prevSearch, setPrevSearch] = useState([]);
    const [songAdded, setSongAdded] = useState("");

    const [expired, setExpired] = useState(false);


    const location = useLocation();
    const navigate = useNavigate();
    const base = import.meta.env.DEV ? '' : '/Spotify-Web-Project'



    const playlistCreated = location.state ? location.state.playlist ? location.state.playlist.id : location.state.id : "NONE"

    const fetchPlaylist = async () => {
        console.log(location.state)

        let result = await fetch(`https://api.spotify.com/v1/playlists/${playlistCreated}`, 
        {
            method: "GET",
            headers: { 
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {

            if(res.status >= 400){
                setExpired(true)
                throw new Error("Expired Token!")
            }

            return res.json()
        }).catch(err => {
            console.log("Re login")
            return null;
        })

        if(result === null) {
            return;
        }
        console.log(result)
        setPlaylist(result)
    }

    const handleSearch = async(e) => {

        e.preventDefault();

        let type = searchType;
        let result = await fetch(`https://api.spotify.com/v1/search?q=${searched}&type=${type}&limit=20&offset=0`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if(res.status >= 400){
                setExpired(true)
                throw new Error("Expired Token!")
            }

            return res.json()
        }).catch(err => {
            console.log("Re login")
            return null;
        })

        console.log(result);
        let prevType = type + 's'
        let prev = [searched, prevType]
        setPrevSearch(prev)
        setSearchResults(result);
    }

    useEffect(() => {
        fetchPlaylist()
    }, [songAdded])

    const copyToken = () => {
        let token = document.getElementById('token-value')
        navigator.clipboard.writeText(token.innerHTML);
    }

    const displaySearchResults = () => {

        let type = prevSearch[1];
        console.log(type)

        if(type === 'artists'){
            return handleArtistResults(type);
        }
        if(type === 'tracks'){
            return handleTrackResults(type);
        }
        if(type === 'albums'){
            return handleAlbumResults(type);
        }

    }

    const handleAddSong = async (song) => {
        console.log(song)
        song = typeof song === "object" ? song : [song]
        let result = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,//?${song}&position=0`, 
        {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({uris: song, position: 0}),
        })
        
        if (result.status === 201 || result.status === 200){
            setSongAdded(song)
        }
    }

    const handleAddAlbum = async (album) => {
        let result = await fetch(`https://api.spotify.com/v1/albums/${album}/tracks?offset=0&limit=20`,
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if(res.status >= 400){
                setExpired(true)
                throw new Error("Expired Token!")
            }

            return res.json()
        }).catch(err => {
            console.log("Re login")
            return null;
        })

        if(result === null){
            console.log("NO TRACKS FOUND IN ALBUM")
        } else{
            let songs = []
            for(let song of result.items){
                songs.push(song.uri)
            }

            console.log(songs);
            handleAddSong(songs);
        }
    }


    const handleArtistResults = (type) => {

        return (
            <div className="search-list-artist">
                {searchResults[type].items.map(item => {
                    return (
                        <div onClick={() => 
                        navigate(`${base}/playlist/search/artist/${item.name}/${item.uri}`, {replace: false, state: {
                            playlist: playlist, 
                            token: location.state.token, 
                            artist: item.name, 
                            id: item.id, 
                            uri: item.uri, 
                            country: location.state.country,
                            owner_token: location.state.owner_token,
                        }})} className="search-item" key={item.id}>
                            <div className="item-name" title={item.name}>{item.name}</div>
                            <img src={item.images.length !== 0 ? item.images[0].url : avatar} alt={item.name + " Pic"}></img>                        
                        </div>
                    )
                })}
            </div>
        )
    }

    const handleTrackResults = (type) => {
    
        return (
            <div className="search-list">
                {searchResults[type].items.map(item => {
                    return (
                        <div className="search-item" key={item.id}>
                            <div className="track-item-name">{item.name}</div>
                            <img src={item.album.images.length !== 0 ? item.album.images[0].url : playlist_image_holder}></img>
                            {item.preview_url !== null ? <audio controls src={item.preview_url ? item.preview_url : ""}>Play</audio> : <div id="preview-msg">No Preview Available</div>}
                            <button className="add-btn" onClick={() => {handleAddSong(item.uri)}}>Add Song</button>
                        </div>
                    )
                })}
            </div>
        )
    }


    const handleAlbumResults = (type) => {

        return (
            <div className="search-list-album">
                {searchResults[type].items.map(item => {
                    return (
                        <div className="album-search-item" key={item.id}>
                            <div className="album-item-name">{item.name}</div>
                            <img src={item.images.length !== 0 ? item.images[0].url : playlist_image_holder} alt={item.name + " Pic"}></img>
                            <div><strong>By: </strong>{item.artists[0].name}</div>
                            <div><strong>Release Date: </strong>{item.release_date}</div>
                            <div><strong>Tracks: </strong>{item.total_tracks}</div>
                            <button className="add-btn" onClick={() => {handleAddAlbum(item.id)}}>Add Album</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    const handleTracksScroll = () => { 

        let device_width = window.innerWidth;
        console.log(device_width)
        if(device_width <= 480) return;

        let scroll = document.getElementsByClassName("list-tracks")
        if(scroll.length === 0) return;
        if (playlist.tracks && playlist.tracks.items.length <= 3){
            scroll[0].style.overflowX = 'hidden';
        }
        else if (playlist.tracks.items.length > 3) {
            scroll[0].style.overflowX = 'scroll';
        }
    }

    const deleteSong = async (song) => {
        const msg = document.getElementById("confirm-msg")
        console.log(msg)
        let result = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,//?${song}&position=0`, 
        {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({tracks: [{uri: song}]}),
        }).then(res => {
            console.log(res)
            if(res.status === 200 || res.status === 201){
                setSongAdded(song)
                msg.style.visibility = 'visible'
                setTimeout(() => {msg.style.visibility = 'hidden'}, 400)
            }
        })

        
    }


    return (
        
        <div className="search-container">
            {expired ? <LoginExpired/> : 
            <div key={playlist.id} className="playlist-created">
                {/* {location.state.shared === undefined && <button className="home-nav-btn" onClick={() => {navigate('/home', {replace: false, state: {token: location.state.token}})}}>Home Page</button>} */}
                <button className="home-nav-btn" onClick={() => {navigate(`${base}/home`, {replace: false, state: {token: location.state.token}})}}>Home Page</button>
                <div className="title"><strong>Playlist: </strong>{playlist.name ? playlist.name : ""}</div>
                <div className="playlist-img-desc">
                    <img className="playlist-img" src={playlist.images ? playlist.images.length !== 0 ? playlist.images[0].url : playlist_image_holder : playlist_image_holder}></img>
                    {playlist.tracks && <div className="Desc-tracks">
                        {playlist.description && 
                            <div id="desc">
                                <strong>Description: </strong>
                                <div className="desc">{playlist.description}</div>
                            </div>
                        }
                        <div><strong>Total Tracks:</strong> {playlist.tracks.total}</div>
                    </div>}
                    {playlist.tracks && playlist.tracks.items.length !== 0 ?
                    <div className="list-tracks">
                        {handleTracksScroll()}
                        {playlist.tracks && playlist.tracks.items.map(track => {
                            return(
                            <div className="track" >
                                <img title="Click Image to Delete Song" onClick={() => {deleteSong(track.track.uri)}} className="track-img" src={track.track.album.images.length !== 0 ? track.track.album.images[0].url : playlist_image_holder}></img>
                                <div className="track-title">{track.track.name}</div>
                            </div>
                            )
                        })}
                    </div> : null}  
                </div>
                {/* <div id="confirm-msg"> Song Deleted</div> */}
            </div>}

            {!expired && playlist.collaborative &&  location.state.shared !== 1 && 
            <div className="share-token">
                <div>Share Token:</div>
                <div id="token-value">{`${playlist.id}/${location.state.token}`}</div> 
                <button className="copy-btn" onClick={copyToken}>Copy Token</button>
            </div>
            }

            {!expired &&<form className="search" onSubmit={(e) => {handleSearch(e)}}>
                <h2>Search:</h2>
                <input type="search" id="search-input" 
                required
                value={searched}
                placeholder="Enter Artist, Song Or Album Name"
                onChange={(e) => setSearched(e.target.value)}/>
                <div className="search-options">
                    <div>
                        <input id="artist" 
                        type="radio" 
                        name="search-tag" 
                        checked={searchType === "artist"}
                        onChange={() => {setSearchType("artist")}}/>
                        <label htmlFor="artist">Artist</label>

                    </div>
                    <div>
                        <input id="track" type="radio" name="search-tag" onChange={() => {setSearchType("track")}}/>
                        <label htmlFor="track">Track</label>
                    </div>
                    <div>
                        <input id="album" type="radio" name="search-tag" onChange={() => {setSearchType("album")}}/>
                        <label htmlFor="album">Album</label>
                    </div>
                </div>
                <button type="submit" id="search-btn">Search</button>
            </form>
            }

            { !expired && prevSearch.length !== 0 && <div className="results">
                {/* <button>{"<"}</button> */}
                {displaySearchResults()}
                {/* <button>{">"}</button> */}
                </div>
            }
        </div>

    )
}
export default Search;