import { useEffect, useState } from 'react';
import '../css/Login.css';
import { useLocation, useNavigate } from 'react-router-dom';


function Login() {

    const [code, setCode] = useState(() => {
        const logged = window.location.search;
        const urlParams = new URLSearchParams(logged)
        let code = urlParams.get('code')
        if(code === undefined || code === null){
            window.sessionStorage.clear();
            return ''
        }
        return code
    })

    const [token, setToken] = useState(() => {
        const token_created = window.sessionStorage.getItem('token')
        if(token_created && token_created !== undefined){
            console.log("TOKEN STATE SET",token_created)
            return token_created
        }
        return ""
    });

    const navigate = useNavigate()
    const location = useLocation();

    const base = import.meta.env.DEV ? '' : '/Spotify-Web-Project'


    const client_id = import.meta.env.VITE_CLIENT_ID;
    const client_secret = import.meta.env.VITE_CLIENT_SECRET;
    let url;
    let redirect_uri = import.meta.env.DEV ? "http://localhost:5173/" : "https://jesus711.github.io/Spotify-Web-Project/"
    let scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public ugc-image-upload';

    const AUTHORIZE = "https://accounts.spotify.com/authorize";
    url = AUTHORIZE;
    url += '?client_id=' + client_id
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=" + scope;

    function handleLogin() {

        const TOKEN = "https://accounts.spotify.com/api/token"

        try {
            let result = fetch(TOKEN, 
                {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
                    },
                    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`
                }).then(res => {
                    return res.json()
                }).then( data => {
                    console.log(data)
                    console.log(data['access_token'])
                    if(data['access_token'] === undefined){
                        return;
                    }
                    window.sessionStorage.setItem('token', data['access_token']);
                    setToken(data['access_token']);
                    navigate(`${base}/home`, {replace: false, state: {token: data['access_token'], refresh: data['refresh_token'], scope: data['scope'], token_type: "Bearer"}})
                }).catch(err => {
                    console.log(err.message)
                })
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {

        if(code && !token) {
            handleLogin()
        }
        else if(token){
            console.log("Token Successfully Created!")
        }
        else{
            console.log("NEED TO LOGIN IN FIRST")
        }

        // Clean Up Function
        return (() => {

        })
    }, [])

    const handleNav = () => {
        return (
            <div>
                <h1>Redirecting to Service...</h1> 
                {navigate(`${base}/home`, {replace: true, state: {token: token}})}
            </div>
        )
    }


    return (

        <div className="login-section">   
            <div>Spotify Login</div>
            <a className="link login-btn" onClick={() => {window.sessionStorage.clear()}} href={url}>Login to Spotify</a>
            <p>Must First Login Into Your Spotify Account to Use Web Service</p> 
            {/* <button className="login-btn">Login to Spotify</button> */}
        </div>

    )
}

export default Login;