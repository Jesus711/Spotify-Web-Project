import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Playlist from "./Playlist";
import '../css/Home.css';
import placeholder_img from '../assets/Empty_Playlist.jpg'
import avatar from '../assets/avatar.webp'
import PlaylistItem from "./PlaylistItem";
import LoginExpired from "./LoginExpired";


function Home() {
    const [userInfo, setUserInfo] = useState("");
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState([]);
    const [expired, setExpired] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();

    const base = import.meta.env.DEV ? '' : '/Spotify-Web-Project'


    async function getUserProfileInfo() {
        console.log("State:", location.state)
        try{
            let result = await fetch("https://api.spotify.com/v1/me", 
            {
                method: "GET", 
                headers: { 'Authorization': `Bearer ${location.state.token}`}
            }).then(res => {
                if(res.status >= 400){
                    setExpired(true)
                    throw new Error("Token Expired!");
                }
                
                return res.json()
            }).catch(err => {
                return null;
            })
            
            setUserInfo(result);
        } catch(err) {
            setExpired(true)
        }
        

    }

    async function getUserPlaylists() {

        let result = await fetch("https://api.spotify.com/v1/me/playlists", 
        {
            method: "GET", 
            headers: { Authorization: `Bearer ${location.state ? location.state.token : ""}`}
        }).then(res => {
            console.log(res)
            if(res.status >= 400){
                setExpired(true)
                throw new Error("Something went wrong")
            }
            return res.json()
        }).catch(err => {
            return null;
        })

        if(result === null){
            return;
        }

        let playlists = [];

        for(let playlist of result.items){
            let id = `"${playlist.id}"`;
            let name = playlist.name;
            let images = playlist.images;
            let desc = playlist.description;
            let total = playlist.tracks.total;
            let publicPlay = playlist.public;
            let collab = playlist.collaborative;
            let link = playlist.external_urls.spotify
            let playlistObj = {"id" : id, "name" : name, "image": images, "description" : desc, 
                                "total" : total, "public" : publicPlay, "collaborative": collab, 
                                "link" : link, "info" : []}
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

        setUserPlaylists(playlists);
    }

    useEffect(() => {
        setTimeout(getUserProfileInfo, 200)
        setTimeout(getUserPlaylists, 500)    
        return (
            // clearTimeout(getUserProfileInfo);
            console.log()
        )
    }, [])

    const handleUI = () => {


        return (
            <div className="user-info">
                <img src={userInfo.images ? userInfo.images[0].url : avatar} alt="profile img"/>
                <div className="account-details">
                    <ul>
                        <li>Country: {userInfo.country}</li>
                        <li>Followers: {userInfo.followers ? userInfo.followers.total : "0"}</li>
                        <li>{userInfo.product === "free" ? "Free" : "Premium"} User</li>
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

        return result;
    }


    const handleEditPlaylist = (id) => {
        let playlist_id = `${id}`.replace('\"', "").replace('\"', "")
        console.log(playlist_id)
        navigate(`${base}/playlist/search`, {replace: false, state: {token: location.state.token, id: playlist_id, country: userInfo.country} })
    }

    const handleDeletePlaylist = async (id) => {
        let playlist_id = `${id}`.replace('\"', "").replace('\"', "")
        let userChoice = window.confirm("Are You Sure You Want to Delete This Playlist?")
        if(userChoice){
            console.log("NOW DELETING PLAYLIST>..")
            let result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/followers`,
            {
                method: "DELETE", 
                headers: { 'Authorization': `Bearer ${location.state.token}`}
            }).then(res =>{
                console.log(res)
            })
            console.log(userPlaylists)
            let playlists = userPlaylists.filter(playlist => {
                return playlist.id != id
            })
            setUserPlaylists(playlists)
        }
        else{
            console.log("CANCELED")
        }



    }

    const displayPlaylists = () => {

        return (
            <div className="playlists-section">
                {userPlaylists.length !== 0 && <div className="section-name">Playlists:</div>}

                <div className="playlists">
                    {userPlaylists && userPlaylists.map((playlist) => {
                        return (
                            <PlaylistItem key={playlist.id} playlist={playlist} handleEditPlaylist={handleEditPlaylist} handleDeletePlaylist={handleDeletePlaylist}/>
                        )})}
                    </div>
            </div>   
        )
    }
    
    const displayOptions = () => {

        return (
            <div className="options">
                <button onClick={() => {navigate(`${base}/playlist`, {replace: false, state: {token: location.state.token, id: userInfo.id, userName: userInfo.display_name, country: userInfo.country} } )}} className="option-btn">
                    <div>Create a PlayList</div>
                </button>
                <button onClick={() => {navigate(`${base}/collab`, {replace: false, state: {token: location.state.token, id: userInfo.id, userName: userInfo.display_name, country: userInfo.country} } )}} className="option-btn">
                    <div>Collab on PlayList</div>
                </button>
            </div>
        )
    }

    return (
        <>
        {expired ? <LoginExpired/> : userInfo ? 
            <div className="user-logged">
                <div className="welcome-msg">Welcome {userInfo.display_name}!</div> 
                {handleUI()}
                {displayOptions()}
                {userPlaylists.length === 0 && <div> <div className="fetch">Retrieving Playlist Information.....</div><div className="load"></div></div>}
                {displayPlaylists()}
            </div> : 
            <div>
                <div className="fetch">Retrieving User Information.....</div>
                <div className="load"></div>
            </div>
        }
        </>
    )
}

export default Home;