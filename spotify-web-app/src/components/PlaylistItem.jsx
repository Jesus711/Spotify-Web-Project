import playlist_image_holder from '../assets/Empty_Playlist.jpg';
import '../css/Home.css';

function PlaylistItem({ playlist, handleEditPlaylist, handleDeletePlaylist }) {

    
    return (
        <div className="playlist">
            <div className="playlist-details">
                <img src={playlist.image.length !==0 ? playlist.image[0].url : playlist_image_holder} alt="playlist-image"></img>
                <div className='playlist-data'>
                    <h3>Title: {playlist.name}</h3>
                    <div><strong>{playlist.collaborative ? "Collaborative": playlist.public ? "Public" : "Private"} Playlist</strong></div>                    
                    {playlist.description && <p><strong>Description: </strong>{playlist.description}</p>}
                    <p><strong>Tracks: {playlist.total}</strong></p>
                </div>
                <div className="edit-delete-btns">
                        <button className="edit-btn" onClick={() => {handleEditPlaylist(playlist.id)}}>Edit Playlist</button>
                        <button className="delete-btn" onClick={() => {handleDeletePlaylist(playlist.id)}}>Delete Playlist</button>
                </div>
            </div>
            <div className="playlist-tracks">
                {playlist.info.map(track => {
                    return (
                        <div className="track" key={track.id}>
                            <img src={track.images[0].url} alt="track-img"/>
                            <div className="track-name"><strong>{track.name}</strong></div>
                            {track.artists.length !== 0 && track.artists.map(artist => {
                                return (
                                    <div className="artist-name" key={artist.name}>{artist.name}</div>
                                )
                            })}
                        </div>
                )})}
            </div>
        </div>
    )
}

export default PlaylistItem;