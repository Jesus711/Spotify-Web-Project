import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import PlaylistItem from "./PlaylistItem";
import playlist_image_holder from '../assets/Empty_Playlist.jpg';
import '../css/Playlist.css';

function Playlist() {

    const [newPlaylistName, setnewPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [publicPlaylist, setPublicPlaylist] = useState(true);
    const [collabPlaylist, setCollabPlaylist] = useState(false);
    const [baseImage, setBaseImage] = useState();
    const [image, setImage] = useState("");
    const [playlistCreated, setPlaylistCreated] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    async function createPlaylist(e){

        e.preventDefault();


        if(newPlaylistName.length <= 0 || typeof newPlaylistName !== 'string'){
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

        console.log(result)
        updatePlaylistImage(result.id);
        setPlaylistCreated(result);
    }

    const updatePlaylistImage = async (playlist) => {
        if(baseImage === undefined || baseImage === null){
            return null;
        }

        let final = await fetch(`https://api.spotify.com/v1/users/${location.state.id}/playlists/${playlist}/images`, 
        {
            method: "PUT",
            headers: { 
                'Authorization': `Bearer ${location.state.token}`,
                'Content-Type': 'image/jpeg',
            },
            body: baseImage,
        })

        console.log(final);
        setBaseImage(final.status == 202 || final.status == 200);

        return null;
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
                    <div>Name: {playlistCreated.name}</div>
                    <div>Viewing: {playlistCreated.collaborative || playlistCreated.public ? "Public": "Private"}</div>
                    <div>Collaborative: {playlistCreated.collaborative ? "True" : "Not Collaborative"}</div>
                </div>
            </div>
        )
    }

    const handleImageUpload = (e) => {
        console.log(e.target.files);
        const data = new FileReader()
        data.addEventListener('load', () => {4
            let img = data.result.replace("data:image/jpeg;base64,", ""); 
            img = img.replace("data:image/png;base64,", ""); 
            img = img.replace("data:image/jpg;base64,", ""); 
            img = img.replace("data:image/jfif;base64,", ""); 
            console.log("done")
            setBaseImage(img);
        })
        data.readAsDataURL(e.target.files[0]);

        let image = URL.createObjectURL(e.target.files[0]);
        setImage(image);
    }


    useEffect(() => {
        if(playlistCreated !== null && baseImage){
            navigate('/playlist/search', {replace: false, state: {playlist: playlistCreated, token: location.state.token}})
        }

    }, [baseImage])






    return (
        <div>
            <h2>Creating A Playlist</h2>
            {/* <div>Enter Playlist Name</div> */}
            <form className="playlist-form-container" onSubmit={(e) => {createPlaylist(e)}}>
            {/* <div className="playlist-form-container"> */}
                <input id="name-input" value={newPlaylistName} onChange={(e) => setnewPlaylistName(e.target.value)} type="text" placeholder="Enter Playlist Name"></input>
                <button id="create-btn"  type="submit">Create</button>
                {/* <button id="create-btn"  onClick={(e) => {createPlaylist(e)}}>Create</button> */}
                <div className="image-radio-options">
                    <div className="playlist-img">
                            <label className="image-label" htmlFor="image">Insert Image</label>
                            <input onChange={(e) => {handleImageUpload(e)}} title="Upload Image" className="image-option" type="file" id="img" name="img" accept="image/*"/>
                    </div>
                    {image && <div className="preview">
                                <div>Preview:</div>
                                <img className="upload" src={image ? image : playlist_image_holder}/>
                                </div>}

                    <div className="playlist-setting">
                        <div className="playlist-view">Viewing: </div>
                        <div className="playlist-creation">
                            <div>
                                <input className="option" id="public-option" name="playlist-status" type="radio" value="Public" onChange={(e) => {setChoices(1)}} checked={publicPlaylist}/>
                                <label className="option-label" htmlFor="public-option">Public</label>
                            </div>
                            <div>
                                <input className="option" id="private-option" name="playlist-status" type="radio" value="Private" onChange={(e) => {setChoices(2)}}/>
                                <label className="option-label" htmlFor="private-option">Private</label>
                            </div>
                            <div>
                                <input className="option" id="collaborative" type="radio" name="playlist-status" value="Collaborative" onChange={(e) => {setChoices(3)}}/>
                                <label className="option-label" htmlFor="collaborative">Collaborative Playlist</label>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="playlist-desc">
                    <label htmlFor="description">Playlist Description (Optional):</label>
                    <textarea id="description" type="text" placeholder="Playlist Description" rows="5"
                        value={playlistDescription} onChange={(e) => {setPlaylistDescription(e.target.value)}}/>
                </div>
            {/* </div> */}

            </form>
            {playlistCreated && <div className="load"></div>}
            {/* {playlistCreated && <PlaylistItem playlistCreated={playlistCreated}/>} */}


        </div>
       
    )
}

export default Playlist;