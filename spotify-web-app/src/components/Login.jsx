import '../App.css';


function Login() {

    const client_id = process.env.REACT_APP_CLIENT_ID;
    const client_secret = process.env.REACT_APP_CLIENT_SECRET;
    let url;
    let redirect_uri = "http://localhost:3000/"
    let scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';


    const AUTHORIZE = "https://accounts.spotify.com/authorize"
    url = AUTHORIZE
    url += '?client_id=' + client_id
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=" + scope;

    // async function handleLogin() {


    //     let url = "https://accounts.spotify.com/authorize";
    //     let scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';
    //     let redirect_uri = "http://localhost:3000/"

    //     const AUTHORIZE = "https://accounts.spotify.com/authorize"
    //     url += '?client_id=' + client_id
    //     url += "&response_type=code";
    //     url += "&redirect_uri=" + encodeURI(redirect_uri)
    //     url += "&show_dialog=true"
    //     url += "&scope=" + scope

    //     // let result = fetch(url);

    //     // url = "https://accounts.spotify.com/api/token"

    //     // let result = await fetch(url, 
    //     //     {
    //     //         method: 'POST',
    //     //         headers: {
    //     //                 'Content-Type': 'application/x-www-form-urlencoded',
    //     //                 'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    //     //         },
    //     //         body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`
    //     //     })
    //     //console.log(result)
    // }


    return (
        <div className="login-section">
            <div>Spotify Login</div>
            <button className="login-btn" onClick={() => {
                console.log("CLICKED!")

            }}>Login to Spotify</button>
            <a href={url}>LOGIN IN</a>
            <p>Must First Login Into Your Spotify Account to Use Web Service</p>
        </div>
    )
}

export default Login;