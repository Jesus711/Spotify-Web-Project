import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Playlist from "./Playlist";
import '../css/Home.css';
import placeholder_img from '../assets/Empty_Playlist.jpg'
import PlaylistItem from "./PlaylistItem";


function Home() {
    const [userInfo, setUserInfo] = useState();
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState();

    const location = useLocation();

    const navigate = useNavigate();

    async function getUserProfileInfo() {

        let result = await fetch("https://api.spotify.com/v1/me", 
        {
            method: "GET", 
            headers: { 'Authorization': `Bearer ${location.state.token}`}
        }).then(res => {
            return res.json()
        }).catch(err => {
            console.log("ERROR")
            console.log("Token Expired Need to Relog in or Something else went wrong")
        })

        ///window.sessionStorage.setItem('user-info', JSON.stringify(result))
        console.log(result);
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

        let playlists = [];

        for(let playlist of result.items){
            let id = `"${playlist.id}"`;
            let name = playlist.name;
            let images = playlist.images;
            let desc = playlist.description;
            let total = playlist.tracks.total;
            let publicPlay = playlist.public;
            let collab = playlist.collaborative;
            let playlistObj = {"id" : id, "name" : name, "image": images, "description" : desc, "total" : total, "public" : publicPlay, "collaborative": collab, "info" : []}
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


        return (
            <div className="user-info">
                <img src={userInfo.images[0].url} alt="profile img"/>
                <div className="account-details">
                    <ul>
                        <li>Country: {userInfo.country}</li>
                        <li>Followers: {userInfo.followers.total}</li>
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
        console.log(id)
        let playlist_id = `${id}`.replace('\"', "").replace('\"', "")
        console.log(playlist_id)
        navigate('/playlist/search', {replace: false, state: {token: location.state.token, id: playlist_id} })
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
            console.log(playlists)
            setUserPlaylists(playlists)
        }
        else{
            console.log("CANCELED")
        }



    }

    const displayPlaylists = () => {

        console.log("DISPLAY PLAYLIST")
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

        console.log("DISPLAY Options")

        return (
            <div className="options">
                <button onClick={() => {navigate('/playlist', {replace: false, state: {token: location.state.token, id: userInfo.id, userName: userInfo.display_name} } )}} className="option-btn">
                    <div>Create a PlayList</div>
                </button>
                <button  onClick={() => {navigate('/collab', {replace: false, state: {token: location.state.token, id: userInfo.id, userName: userInfo.display_name} } )}} className="option-btn">
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