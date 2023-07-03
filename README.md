# Spotify-Web-Project
Recreating a Group Project, Spotify Collaborative Playlists, that used ReactJS, Material UI, Python Flask, Spotify Web API and Heroku to deploy.

Used ReactJS, Javascript, HTML, CSS, and the Spotify Web API to Create

# Only Developers Are Able to Use The Spotify Service 

Live: https://jesus711.github.io/Spotify-Web-Project/

Demo Video: https://youtu.be/qAaM1way9l0

# Features:
- Login in to Spotify Account
- Displays User's Image, Country, Follower Count, and Whether User is a Free or Premium User
- Displays Public and Private Playlists created in their account
- Allows user to open playlist in spotify for the user to start listening to the playlist
- Allows User to Create Playlists
- Allows User to Delete a Playlist
- Allows User to Edit a playlist by adding or removing songs.
- Allows User to Collab with another user's playlist by adding or removing songs by entering collab token.
- Allows user to search for Artists, Tracks, or Albums by selecting one of the three radio options default is Artist.
- Able to Delete Songs from Playlist by tapping/clicking on Song Image
- Able to Add Songs or an entire album when searching for tracks or albums.
- Able to view Artist Info by tapping/clicking on Artist.
- Displays Artist Information such as Image, Follower Count, Popularity Number, Genres. Along with their Top 10 Tracks that can be added, albums, and related artists.

# Spotify Web API Limitations:
- Only up to 25 users are allowed to use. 
- The owner of the has to manually add spotify account emails that wish to use the service. 
- Only spotify accounts added to developer dashboard of web service may use it.
- Only way to increase the number of users is through requesting Spotify to increase the number of users.

# More Detailed Explanation on Features:
- Click on SpotifyCollab Text to Log Out

## Home Page:
- Public, Private and Collaborative are displayed with the playlist image, whether the playlist is collaborative, private or public. The playlist description and the total number of tracks in the playlist.
- Also, the tracks of each playlist are shown.
- User may delete a playlist and a confirmation alert will appear.
- Editing a playlist redirects user to the search page.
- CLicking on Start Playing will redirect you to the spotify app if download on mobile, spotify.com depending on resolution, or to open.spotify.com with the playlist songs allowing the user to listen to the playlist.

## Playlist Creation Page
- May add an image to be used for the playlist (MAX Size is 256 KB). May choose Public, Private or Collaborative Playlist (Default). May Add a Description to Playlist.
- If description is left empty, a default description is added "Created By SpotifyCollab Web APP". 
- After Creating A Playlist, the user is redirected to the search page.


## Collab Page
- Allows user to enter the collab token that should have been sent or shared by the owner of the playlist.
- If the collab/share token is valid, the playlist should appear below with the playlist name, the owner's username, playlist image, title, description total tracks, edit playlist button, start playing button, and the track list if any tracks exist in the playlist.
- Clicking on Edit Playlist will redirect user to search page allowing them to add or removing songs.

## Search Page
-After creating or clicking on edit playlist, the current playlist details(Image, name, track total, and track list) are displayed.
- Tapping on the song image will remove the song from the playlist.
- If the playlist is collaborative, a share token will appear and able to be copied. Share token will allow users to add or remove songs to the playlist. Share through messaging. 
- When searching for artists, each artist 'card' is clickable to redirect to the Artist Page.
- Searching for Tracks, each result will have the tracks name, track image, a preview if available, and an 'Add Song' button. After clicking the button, the song is added to the playlist. If not shown above, may need to re-login.
- Searching for albums, displays albums and allows user to add the entire album to the playlist.


## Artist Page
- User arrives to an artist page after clicking on an artist 'card' after searching for artists
- The artist page displays information about the artist clicked such as Image, Follower Count, Popularity Number, Genres.
- Displays the Artist's Top 10 Tracks that can be added
- Displays each album with a button to view its entirety, and related artists.

## Album Page
- User Arrives to album page after clicking on 'View Album' on an Artist Page
- Display All Songs in an Album when on Artist Page and click on 'View Album'.
- Allows user to add any song from the album.
