import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import playlist_image_holder from '../assets/Empty_Playlist.jpg';
import '../css/Album.css';


export default function Album() {

    const [albumSongs, setAlbumSongs] = useState([])

    const location = useLocation();

    const album = location.state.album;

    async function getAlbumTracks() {

        console.log(location.state)

        let result = await fetch(`https://api.spotify.com/v1/albums/${location.state.id}/tracks?offset=0&limit=20`,
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
            return
        }

        let songs = []
        for(let song of result.items){
            songs.push(song)
        }
        
        console.log(songs)
        setAlbumSongs(songs)
    }


    useEffect(() => {
        getAlbumTracks()
    }, [])


    const handleAddSong = async (song) => {
        console.log(song)
        song = typeof song === "object" ? song : [song]
        let result = await fetch(`https://api.spotify.com/v1/playlists/${location.state.playlist.id}/tracks`,//?${song}&position=0`, 
        {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({uris: song, position: 0}),
        })

        console.log(result)
    }


  return (
    <div className="album-display">
        <div className="album-details">
            <div className="item-name" title={album.name}>{album.name}</div>
            <img src={location.state.images ? location.state.images[0].url : playlist_image_holder} alt={album.name + " Pic"}></img>
            <div><strong>By:</strong> {location.state.artist.name}</div>
            <div><strong>Release Date: </strong>{album.release_date}</div>
            <div><strong>Tracks: </strong>{album.total_tracks}</div>
        </div>
        <div className="album-tracks">
            {albumSongs.length !== 0 && albumSongs.map(item => {
                    return (
                        <div className="search-item" key={item.id}>
                            <div className="track-item-name">{item.name}</div>
                            <img src={location.state.images ? location.state.images[0].url : playlist_image_holder}></img>
                            {item.preview_url !== null ? <audio controls src={item.preview_url ? item.preview_url : ""}>Play</audio> : "No Preview Available"}
                            <button className="add-btn" onClick={() => {handleAddSong(item.uri)}}>Add Song</button>
                        </div>
                    )
                })}
        </div>
    </div>
  )
}
