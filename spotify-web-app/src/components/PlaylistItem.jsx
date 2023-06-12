import playlist_image_holder from '../assets/Empty_Playlist.jpg';

function PlaylistItem({ playlistCreated }) {

    
    return (
        <div key={playlistCreated.id} className="playlist-created">
            {playlistCreated && <div className="section-name">Created Playlist:</div>}
            <div className="playlist-item">
                <div className="playlist">
                    <div className="playlist-details">
                        <img src={playlistCreated.image ? playlistCreated.image[0].url : playlist_image_holder}></img>
                        <div>
                            <h3>Title: {playlistCreated.name}</h3>
                            {playlistCreated.description && <p><strong>Description: </strong>{playlistCreated.description}</p>}
                            <p><strong>Tracks: {playlistCreated.tracks.total}</strong></p>
                        </div>
                    </div>
                </div>
            </div>   
        </div>
    )
}

export default PlaylistItem;