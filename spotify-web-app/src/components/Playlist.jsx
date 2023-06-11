import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import PlaylistItem from "./PlaylistItem";

function Playlist() {

    const [newPlaylistName, setnewPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [publicPlaylist, setPublicPlaylist] = useState(true);
    const [collabPlaylist, setCollabPlaylist] = useState(false);
    const [playlistCreated, setPlaylistCreated] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    async function createPlaylist(){

        console.log(newPlaylistName);

        if(newPlaylistName.length <= 0 || typeof newPlaylistName !== 'string'){
            console.log("here")
            return;
        }

        let token = location.state.token;
        let user_id = location.state.id;
        let name = newPlaylistName;
        let desc = playlistDescription
        let collab = collabPlaylist
        let userChoice = publicPlaylist; // Public set to false
        let setPublic = collab ? false : userChoice ? true : false; // If collab is set to true then set public to false, else set to true


        let result = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, 
        {
            method: "POST",
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ name: name, public: setPublic, collaborative: collab, description: desc }),
            // If collaborative playlist, public must be set to false
        }).then(res => {
            return res.json()
        })

        console.log(result);
        setPlaylistCreated(result);
    }

    const setChoices = (choice) => {
        if (choice === 1){
            setPublicPlaylist(true);
            setCollabPlaylist(false);
        }
        if (choice === 2){
            setPublicPlaylist(false);
            setCollabPlaylist(false);
        }
        else {
            setCollabPlaylist(true); //If Collaborative, playlist will be public;
        }

    }


    const handlePlaylistCreate = () => {
        return (
            <div>
                <div><strong>Creating a Playlist with the following details:</strong></div>
                <div>
                    <div>Name: {newPlaylistName}</div>
                    <div>Viewing: {collabPlaylist || publicPlaylist ? "Public": "Private"}</div>
                    <div>Collaborative: {collabPlaylist ? "True" : "Not Collaborative"}</div>
                </div>
            </div>
        )
    }


    return (
        <div>
            <h2>Creating A Playlist</h2>
            {/* <div>Enter Playlist Name</div> */}
            {/* <form className="playlist-form" onSubmit={createPlaylist()}> */}
            <div className="playlist-form-container">
                <input id="name-input" value={newPlaylistName} onChange={(e) => setnewPlaylistName(e.target.value)} type="text" placeholder="Enter Playlist Name"></input>
                <button id="create-btn"  onClick={() => {createPlaylist()}}>Create</button>
                <div className="playlist-creation">
                    <div>
                        <input id="public-option" name="playlist-status" type="radio" value="Public" onChange={(e) => {setChoices(1)}} checked={publicPlaylist}/>
                        <label htmlFor="public-option">Public</label>
                    </div>
                    <div>
                        <input id="private-option" name="playlist-status" type="radio" value="Private" onChange={(e) => {setChoices(2)}}/>
                        <label htmlFor="private-option">Private</label>
                    </div>
                    <div>
                        <input id="collaborative" type="radio" name="playlist-status" value="Collaborative" onChange={(e) => {setChoices(3)}}/>
                        <label htmlFor="collaborative">Collaborative Playlist</label>
                    </div>
                </div>

                <div className="playlist-desc">
                    <label htmlFor="description">Playlist Description (Optional):</label>
                    <textarea id="description" type="text" placeholder="Playlist Description" rows="5"
                        value={playlistDescription} onChange={(e) => {setPlaylistDescription(e.target.value)}}/>
                </div>
            </div>
                {/* <div>
                    <label htmlFor="image">Choose Image</label>
                    <input type="file" id="img" name="img" accept="image/*"/>
                </div> */}
            {/* </form> */}

            {playlistCreated && handlePlaylistCreate()}
            {playlistCreated && <PlaylistItem playlistCreated={playlistCreated}/>}

        </div>
       
    )
}

export default Playlist;