import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Artist() {
    const [artist, setArtist] = useState("");
    const [songs, setSongs] = useState("");
    const [albums, setAlbums] = useState("");
    const [relatedArtists, setRelatedArtists] = useState([])

    const location = useLocation();
    const navigate = useNavigate();


    async function getArtistInfo() {

        console.log(location.state)

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state.token}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            return res.json()
        })

        console.log("GOT ArtistINFO", result)
        setArtist(result);
    }

    async function getArtistTopTracks() {

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}/top-tracks?market=${location.state.country}`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state.token}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            return res.json()
        })

        console.log("GOT ArtistTopTracks", result)
        setSongs(result);
    }

    async function getArtistAlbumsInfo() {

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}/albums?market=${location.state.country}`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state.token}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            return res.json()
        })

        console.log("GOT ArtistAlbums", result)
        setAlbums(result);
    }

    async function getRelatedArtists() {

        let result = await fetch(`https://api.spotify.com/v1/artists/${location.state.id}/related-artists`, 
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${location.state.token}`,
                'Content-Type': 'application/json',
            },
        }).then(res => {
            return res.json()
        })

        console.log("GOT RelatedArtists", result)
        setAlbums(result);
    }





    useEffect(() => {
        getArtistInfo()
        getArtistTopTracks()
        getArtistTopTracks()
        getRelatedArtists()
    }, [])


    return (
        <div>
            <h2>Artist Name: {location.state.artist}</h2>
        </div>
    )
}

export default Artist;