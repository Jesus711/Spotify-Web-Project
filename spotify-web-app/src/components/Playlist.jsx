import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import PlaylistItem from "./PlaylistItem";
import playlist_image_holder from '../assets/Empty_Playlist.jpg';
import '../css/Playlist.css';
import LoginExpired from "./LoginExpired";

function Playlist() {

    const [newPlaylistName, setnewPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [publicPlaylist, setPublicPlaylist] = useState(false);
    const [collabPlaylist, setCollabPlaylist] = useState(true);
    const [baseImage, setBaseImage] = useState();
    const [image, setImage] = useState("");
    const [playlistCreated, setPlaylistCreated] = useState(null);

    const [expired, setExpired] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    async function createPlaylist(e){

        e.preventDefault();


        if(newPlaylistName.length <= 0 || typeof newPlaylistName !== 'string'){
            return;
        }

        let token, user_id, name, desc, collab, userChoice, setPublic;

        try {
            token = location.state.token;
            user_id = location.state.id;
            name = newPlaylistName;
            desc = playlistDescription.length === 0 ? "Created By SpotifyCollab Web APP" : playlistDescription;
            collab = collabPlaylist
            userChoice = publicPlaylist; // Public set to false
            setPublic = collab ? false : userChoice ? true : false; // If collab is set to true then set public to false, else set to true
        } catch(err) {
            console.log("Not Logged In")
            setExpired(true)
            return;
        }



        let result = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, 
        {
            method: "POST",
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ name: name, public: setPublic, collaborative: collab, description: desc }),
        }).then(res => {
            if(res.status >= 400){
                throw new Error("Token Expired")
            }
            return res.json()
        }).catch(err => {
            console.log("Login Again")
            setExpired(true)
            return null
        })

        if(result === null) return;

        updatePlaylistImage(result.id);
        setPlaylistCreated(result);
    }

    const updatePlaylistImage = async (playlist) => {
        if(baseImage === undefined || baseImage === null){
            setBaseImage("No image")
            return false;
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

        return true;
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
        if (choice === 3) {
            setCollabPlaylist(true); //If Collaborative, playlist will be public;
            setPublicPlaylist(false);
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
            setTimeout(() => { navigate('/playlist/search', {replace: false, state: {playlist: playlistCreated, token: location.state.token, country: location.state.country}})}, 
            500)
        }

    }, [baseImage])

    const handleSearchNav = () => {
        const playlist_form = document.getElementsByClassName('playlist-form-container')
        playlist_form[0].style.display = "none";

        return(
            <div className="load"></div>
        )
    }


    return (
        <div>
            <h2>{expired ? "" : !playlistCreated ? "Creating A Playlist" : "Creating Your Playlist......"}</h2>
            {expired ? <LoginExpired/> : 
            <form className="playlist-form-container" onSubmit={(e) => {createPlaylist(e)}}>
                <input id="name-input" value={newPlaylistName} onChange={(e) => setnewPlaylistName(e.target.value)} type="text" placeholder="Enter Playlist Name"></input>
                <button id="create-btn"  type="submit">Create</button>
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
                                <input className="option" id="public-option" name="playlist-status" type="radio" value="Public" onChange={(e) => {setChoices(1)}}/>
                                <label className="option-label" htmlFor="public-option">Public</label>
                            </div>
                            <div>
                                <input className="option" id="private-option" name="playlist-status" type="radio" value="Private" onChange={(e) => {setChoices(2)}}/>
                                <label className="option-label" htmlFor="private-option">Private</label>
                            </div>
                            <div>
                                <input className="option" id="collaborative" type="radio" name="playlist-status" value="Collaborative" checked={collabPlaylist} onChange={(e) => {setChoices(3)}}/>
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
            </form>
            }
            {playlistCreated && handleSearchNav()}
        </div>
       
    )
}

export default Playlist;