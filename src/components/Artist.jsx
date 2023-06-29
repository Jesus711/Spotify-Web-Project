import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import avatar from '../assets/avatar.webp';
import '../css/Artist.css';

function Artist() {
    const [artist, setArtist] = useState({});
    const [songs, setSongs] = useState({});
    const [albums, setAlbums] = useState({});
    const [relatedArtists, setRelatedArtists] = useState([])

    const [relatedInfo, setRelatedInfo] = useState({})

    const location = useLocation();
    const navigate = useNavigate();
    const base = import.meta.env.DEV ? '' : '/Spotify-Web-Project'


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


    async function getArtistInfo() {

        console.log(location.state)

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if(res.status >= 400)
                throw new Error("Token Expired")
            return res.json()
        }).catch(err => {
            return null;
        })

        if( result === null) return;

        console.log("GOT Artist", result)
        setArtist(result);
    }

    async function getArtistTopTracks() {

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}/top-tracks?market=${location.state.country}`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if(res.status >= 400)
                throw new Error("Token Expired")
            return res.json()
        }).catch(err => {
            return null;
        })

        if( result === null) return;
        console.log("GOT Top Tracks", result)
        setSongs(result);
    }

    async function getArtistAlbumsInfo() {

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}/albums?market=${location.state.country}`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if(res.status >= 400)
                throw new Error("Token Expired")
            return res.json()
        }).catch(err => {
            return null;
        })

        if( result === null) return;
        console.log("Albums", result)
        setAlbums(result);
    }

    async function getRelatedArtists() {

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}/related-artists`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state ? location.state.owner_token ? location.state.owner_token : location.state.token : ""}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if(res.status >= 400)
                throw new Error("Token Expired")
            return res.json()
        }).catch(err => {
            return null;
        })

        if( result === null) return;

        console.log("GOT RelatedArtists", result)
        setRelatedArtists(result);
    }

    useEffect(() => {
        getArtistInfo()
        getArtistTopTracks()
        getArtistAlbumsInfo()
        getRelatedArtists()
        }, [relatedInfo.uri])

    
    function getSearchParams(){
        // Retrieves Current pathname and gets the artist name and uri
        let path = window.location.pathname.split("/")
        let artist = path[path.length-2]
        let uri = path[path.length-1]
        artist = artist.split("%20").join(" ")
        setRelatedInfo({
            name: artist,
            uri: uri
        })
    }

    return (
        <div id="artist-section">
            <div className="artist-details">
                <img src={artist.images ? artist.images[0].url : avatar}/>
                <div className="artist-stats">
                    <div><strong>Artist:</strong> {artist.name}</div>
                    <div><strong>Followers:</strong> {artist.followers ? artist.followers.total !== null ? artist.followers.total : "Unavailable" : ""}</div>
                    <div><strong>Popularity:</strong> {artist.popularity}</div>
                    <div><strong>Genres: </strong></div>
                        <ul>
                            {artist.genres ? artist.genres.slice(0, 4).map(genre => {return <li key={genre}>{genre.toUpperCase()}</li>}) : "Not Available"}
                        </ul>

                </div>
            </div>
            <h2>Top Tracks:</h2>
            <div className="artist-top-tracks">
                {songs.tracks ? songs.tracks.map(track => {
                    return (
                        <div className="search-item" key={track.id}>
                            <div className="track-item-name">{track.name}</div>
                            <img src={track.album.images.length !== 0 ? track.album.images[0].url : playlist_image_holder}></img>
                            {track.preview_url !== null ? <audio controls src={track.preview_url ? track.preview_url : ""}>Play</audio> : "No Preview Available"}
                            <button className="add-btn" onClick={() => {handleAddSong(track.uri)}}>Add Song</button>
                        </div>
                    )
                }) : "None Found"}
            </div>

            <h2>Albums:</h2>
            <div className="artist-albums">
            {albums.items ? albums.items.map(item => {
                    return (
                        <div className="album-search-item">
                            <div className="album-item-name" title={item.name}>{item.name}</div>
                            <img src={item.images.length !== 0 ? item.images[0].url : avatar} alt={item.name + " Pic"}></img>
                            <div><strong>Release Date: </strong>{item.release_date}</div>
                            <div><strong>Tracks: </strong>{item.total_tracks}</div>
                            <button className="add-btn" 
                            onClick={() => 
                            navigate(`${base}/playlist/search/artist/album`, {replace: false, 
                            state: {
                                playlist: location.state.playlist,
                                token: location.state.token, 
                                artist: artist,
                                album: item,
                                name: item.name, 
                                images: item.images,
                                id: item.id, 
                                uri: item.uri, 
                                country: location.state.country,
                                owner_token: location.state.owner_token,
                            }})} 
                                key={item.id}>
                                View Album</button>
                        </div>
                    )
                }) : "Related"}
            </div>
            <h2>Related Artists:</h2>
            <div className="related-artists">
                {relatedArtists.artists ? relatedArtists.artists.map(item => {
                    return (
                        <div onClick={() => {
                            document.getElementsByClassName('App-title')[0]?.scrollIntoView({ behavior: 'smooth' });
                            navigate(`${base}/playlist/search/artist/${item.name}/${item.uri}`, {replace: true, state: {playlist: location.state.playlist, token: location.state.token, 
                                artist: item.name, id: item.id, uri: item.uri, country: location.state.country, owner_token: location.state.owner_token,}})
                            getSearchParams()
                        }}
                            className="search-item" key={item.id}>
                            <div className="item-name" title={item.name}>{item.name}</div>
                            <img className="artist-photo" src={item.images.length !== 0 ? item.images[0].url : avatar} alt={item.name + " Pic"}></img>
                        </div>
                    )
                }) : "Related"}
            </div>
        </div>
    )
}

export default Artist;