import { useLocation } from "react-router-dom";

function Search() {


    const location = useLocation();
    console.log(location.state);


    return (
        <div className="search">
            <h2>Search:</h2>
            <input type="text" id="search-input"></input>
            <button type="submit" id="search-btn">Search</button>

        </div>
    )
}
export default Search;