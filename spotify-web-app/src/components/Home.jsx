import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Playlist from "./Playlist";
import '../App.css';


function Home() {
    const [userInfo, setUserInfo] = useState();
    const [userPlaylists, setUserPlaylists] = useState();
    const [playlistInfo, setPlaylistInfo] = useState();

    const location = useLocation();

    const navigate = useNavigate();

    async function getUserProfileInfo() {

        let result = await fetch("https://api.spotify.com/v1/me", 
        {
            method: "GET", 
            headers: { Authorization: `Bearer ${location.state.token}`}
        }).then(res => {
            return res.json()
        }).catch(err => {
            console.log("ERROR")
            console.log("Token Expired Need to Relog in or Something else went wrong")
        })

        console.log("FINISHED GET USER INFO")
        ///window.sessionStorage.setItem('user-info', JSON.stringify(result))
        setUserInfo(result);
    }

    async function getUserPlaylists() {

        let result = await fetch("https://api.spotify.com/v1/me/playlists", 
        {
            method: "GET", 
            headers: { Authorization: `Bearer ${location.state.token}`}
        }).then(res => {
            return res.json()
        }).catch(err => {
            console.log("ERROR")
            console.log("Token Expired Need to Relog in or Something else went wrong")
        })

        console.log("FINISHED GET Playlists")
        console.log(result)
        let playlists = [];

        for(let playlist of result.items){
            let id = `"${playlist.id}"`;
            let name = playlist.name;
            let images = playlist.images;
            let desc = playlist.description;
            let total = playlist.tracks.total;
            let playlistObj = {"id" : id, "name" : name, "image": images, "description" : desc, "total" : total, "info" : []}
            let tracks = await getPlaylistTracks(playlist.tracks.href)
            for(let track of tracks.items){
                let tid = track.track.id
                let tname = track.track.name
                let artists = track.track.artists
                let preview = track.track.preview_url
                let data = [tid, tname, artists, preview]
                let trackObj = {}
                trackObj["id"] = tid;
                trackObj["name"] = tname;
                trackObj["artists"] = artists;
                trackObj["preview"] = preview;
                trackObj["images"] = track.track.album.images;
                playlistObj["info"].push(trackObj);
            }
            playlists.push(playlistObj)
        }
        console.log(playlists)

        ///window.sessionStorage.setItem('user-info', JSON.stringify(result))
        setUserPlaylists(playlists);
    }

    useEffect(() => {
        // if(window.sessionStorage.getItem('user-info')){
        //     console.log("ALREADY LOGGED IN")
        //     setUserInfo(JSON.parse(window.sessionStorage.getItem('user-info')))
        // }
        // else{
        //     setTimeout(getUserProfileInfo, 1000)
        // }
        setTimeout(getUserProfileInfo, 500)
        setTimeout(getUserPlaylists, 800)

        return (
            // clearTimeout(getUserProfileInfo);
            console.log()
        )
    }, [])

    const handleUI = () => {

        let image = userInfo.images[0].url
        return (
            <div className="user-info">
                <img src={userInfo.images[0].url} alt="profile img"/>
                <div className="account-details">
                    <ul>
                        <li>Country: {userInfo.country}</li>
                        <li>Followers: {userInfo.followers.total}</li>
                        <li>Premium User</li>
                    </ul>
                </div>
            </div>
        ) 
    }

    async function getPlaylistTracks(playlistID) {
        let result = await fetch(playlistID, 
        {
            method: "GET", 
            headers: { Authorization: `Bearer ${location.state.token}`}
        }).then(res => {
            return res.json()
        }).catch(err => {
            console.log("ERROR")
            console.log("Token Expired Need to Relog in or Something else went wrong")
        })

        console.log(result);
        return result;
    }

    const displayPlaylists = () => {


        return (
            <div className="playlists-section">
                <h2>Playlists:</h2>
                <div className="playlists">
                    {userPlaylists && userPlaylists.map((playlist, index) => {
                        return (
                            <div key={playlist.id}  className="playlist">
                                <div className="playlist-details">
                                    <img src={playlist.image[0].url}></img>
                                    <div>
                                        <h3>Title: {playlist.name}</h3>
                                        <p>Description: {playlist.description}</p>
                                        <p>Tracks: {playlist.total}</p>
                                    </div>
                                </div>

                                <div className="playlist-tracks">
                                    {playlist.info.map(track => {
                                        return (
                                            <div className="track" key={track.id}>
                                                <img src={track.images[0].url} alt="track-img"/>
                                                <div><strong>{track.name}</strong></div>
                                                {track.artists.length !== 0 && track.artists.map(artist => {
                                                    return (
                                                        <div>{artist.name}</div>
                                                    )
                                                })}
                                            </div>
                                            )
                                        })}
                                    </div>
                                </div>
                        )})}
                    </div>
            </div>   
        )
    }
    
    const displayOptions = () => {
        return (
            <div className="options">
                <button onClick={() => {navigate('/playlist')}} className="option-btn">
                    <div>Create a PlayList</div>
                </button>
                <button  onClick={() => {navigate('/collab')}} className="option-btn">
                    <div>Collab on PlayList</div>
                </button>
            </div>
        )
    }

    return (
        <>
        {userInfo ? 
        <div className="user-logged">
            <div className="welcome-msg">Welcome {userInfo.display_name}!</div> 
            {handleUI()}
            {displayOptions()}
            {/* {displayPlaylists()} */}
        </div>: 
        <div className="fetch">Retrieving User Information.....</div>}
        </>
    )
}

export default Home;