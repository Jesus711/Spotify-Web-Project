import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Collab.css';
import { useState } from 'react';
import PlaylistItem from './PlaylistItem';

function Collab() {

    const [collabToken, setCollabToken] = useState("");
    const [inputToken, setInputToken] = useState("");
    const [playlist, setPlaylist] = useState({});
    const [ownerToken, setOwnerToken] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const base = import.meta.env.DEV ? '' : '/Spotify-Web-Project'


    async function getCollabPlaylist(e) {

        e.preventDefault()

        let collabPlaylist = collabToken.split("/")
        if(collabPlaylist.length <= 1){
            setInputToken("None")
            return null;
        }

        let owner_token = collabPlaylist[1];
        setOwnerToken(owner_token)

        let result = await fetch(`https://api.spotify.com/v1/playlists/${collabPlaylist[0]}`,//?${song}&position=0`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state.token}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            console.log(res)
            if (res.status >= 400){
                setPlaylist({})
                setInputToken("None")
                return null;
            }
            return res.json()
        })

        if(result === null){
            return null
        }

        setInputToken(collabToken)
        let id = `"${result.id}"`;
        let name = result.name;
        let images = result.images;
        let desc = result.description;
        let total = result.tracks.total;
        let publicPlay = result.public;
        let collab = result.collaborative;
        let owner = result.owner.display_name;
        let playlist = {"id" : id, "owner": owner, "name" : name, "image": images, "description" : desc, "total" : total, "public" : publicPlay, "collaborative": collab, "shared": 1, "info" : []}
        for(let track of result.tracks.items){
                let tid = track.track.id
                let tname = track.track.name
                let artists = track.track.artists
                let preview = track.track.preview_url
                let trackObj = {}
                trackObj["id"] = tid;
                trackObj["name"] = tname;
                trackObj["artists"] = artists;
                trackObj["preview"] = preview;
                trackObj["images"] = track.track.album.images;
                playlist["info"].push(trackObj);
            }
        setPlaylist(playlist)
    }

    const handleEditPlaylist = async (id) => {

        console.log(id)
        let playlist_id = `${id}`.replace('\"', "").replace('\"', "")
        console.log(playlist_id)

        // Follow Playlist
        let result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/followers`,{
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${location.state.token}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            console.log(res)
        })



        navigate(`${base}/playlist/search`, {replace: false, state: {token: location.state.token, id: playlist_id, country: location.state.country, "shared": 1, "owner_token": ownerToken} })
    }


    const handleCollabTokenSearch = () => {

        if((playlist.id === undefined && inputToken === "None") || (playlist.id !== undefined && inputToken === "None")){
            
            return (
                <div>No Playlist Found!</div>
            )
        }
        else if (playlist.id === undefined){
            return
        }
        
        return (
        <div className='collab-result'>
            <div className='result-text'>Playlist Found</div>
            <div className='result-text'>Owner: {playlist.owner}</div>
            <PlaylistItem playlist={playlist} handleEditPlaylist={handleEditPlaylist}/>
        </div>
        )
    }




    return (
        <div className='collab-playlist'>
            <form className="collab-playlist-form" onSubmit={(e) => {getCollabPlaylist(e)}}>
                <div><strong>Collab Playlist</strong></div>
                <input id="name-input" value={collabToken} onChange={(e) => setCollabToken(e.target.value)} type="text" placeholder="Enter Share Token"/>
                <button id="create-btn"  type="submit">Collab</button>
            </form>
            {handleCollabTokenSearch()}
        </div>
    )
}

export default Collab;