import React, { useState, useEffect, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

toast.configure();

const Wrapper = styled.div`
    width: 70%;
    margin: 0 auto;
    @media (max-width: 768px) {
        width: 95%;
    }
`;

const Divider = styled.hr`
    color: white;
`;

const SearchBar = styled.input`
    width: 100%;
    height: 25px;
    padding: 1rem 0rem;
    text-align: center;
    font-family: PT Sans Narrow; 
    font-size: 20px;
    @media (max-width: 768px) {
        font-size: 12px;
        text-align:left;
    }
`;

const Btn = styled.button`
    background: transparent;
    border-radius: 3px;
    border: 2px solid white;
    color: white;
    margin: 0.5em 1em;
    padding: 0.25em 1em;

    ${props => props.primary && css`
        background: white;
        color: #1f2833;
        border: 2px solid #1f2833;
        position: relative;
        margin-left: -75px;
        height: 45px;
    `}
    ${props => props.secondary && css`
        background: white;
        color: #1f2833;
        border: 2px solid #1f2833;
        height: 45px;
        font-family: PT Sans Narrow; 
        font-size: 20px;
        @media (max-width: 768px) {
            margin: 0 auto;
            height: auto;
            margin-top: 10px;
        }
    `}
    &:hover{
        background: #1f2833;
        border: 2px solid #1f2833;
        color: white;
        ${props => props.secondary && css`
            border: 2px solid white !important;
        `}
    }
`;

const Next = styled.button`
    background: transparent;
    position: absolute;
    padding: 1rem;
    top: 50%;
    height: 45px;
    right: 0;
    color: white;
    border: none;
    font-size: 40px;
    &:hover i{
        color: #66fcf1;
    }
`;

const TituloList = styled.h3`
    text-align: center;
    font-family: PT Sans Narrow; 
    font-size: 20px;
    color: white;
`;

const ListGames = styled.div`
    margin-top: 5%;
    border: 2px solid white;
    color: white;
    padding: 0.4rem 1rem;
    text-align: center;
    font-family: PT Sans Narrow; 
    font-size: 20px;
`;

const GameDetails = styled.div`
    width: inherit;
    display: grid;
    grid-gap: 4%;
    grid-template-columns: 22% 22% 22% 22%;
    margin: 0 auto;
    @media (max-width: 768px) {
        grid-template-columns: 40% 40%;
    }
`;

function AddGame() {
    const [eliminado, setEliminado] = useState(false);
    const [search, setSearch] = useState("");
    const [game, setGame] = useState();
    const [chosenGames, setChosenGames] = useState([]);
    const [genres, setGenres] = useState("");

    const tags = ["2D", "RPG", "Co-op", "Story Rich", "Difficult", "Online Co-Op", "Sandbox", "Comedy", "Survival", "Stealth", "Online multiplayer", "Tactical", "Pixel Graphics", "Zombies", "Point & Click", "Turn-Based", "Hack and Slash", "Action-Adventure", "Replay Value", "Post-apocalyptic", "Side Scroller", "Physics", "Fast-Paced", "Mystery", "Walking Simulator", "Roguelike", "Beat 'em up", "Dystopian", "Metroidvania", "Cyberpunk", "Building", "Top-Down", "Steampunk", "Shoot 'Em Up", "Puzzle-Platformer", "Multiple Endings", "Detective", "JRPG", "Management", "Visual Novel", "Dungeon Crawler", "Roguelite", "Linear", "Relaxing", "Loot", "Tower Defense", "Procedural Generation", "Bullet Hell", "Superhero", "Grand Stategy"];

    const handleAddGame = () => {
        setGame(search);
    }

    const handleEnter = (e) => {
        if(e.keyCode === 13)
            handleAddGame();
    }

    const removeGame = (index) => {
        (chosenGames[index].tags).map(tagsarray => (
            genres.replace(tagsarray.name, " ") 
        ))

        chosenGames.splice(index, 1);
        setEliminado(true);
    }

    async function getGames() {
        setEliminado(false); 

        if(game) {
            const res = await fetch("https://api.rawg.io/api/games?search="+game);
            const GamesArray = await res.json();
            if((GamesArray.results).length !== 0) {

                setChosenGames(chosenGames.concat(GamesArray.results[0]));

                let allGenres = "";

                (GamesArray.results[0].tags).map(tagsarray => (
                    !genres.includes(tagsarray.name) && tags.includes(tagsarray.name) ? allGenres += tagsarray.name + "," : ""
                ))

                setGenres(genres.concat(allGenres));
            }
            else toast.error("Couldn't find any games matching your criteria.", { position: "bottom-right" });
        } 
        setGame("");
        setSearch("");
    }

    useEffect(() => {
        getGames(); 

        let gameName = chosenGames.map(games => (
            games.name
        ))

        gameName.some((item, id) => (
            gameName.indexOf(item) !== id ? removeGame(id) + toast.error("Game has already been selected.", { position: "bottom-right" }) : ""
        )) 
    }, [game, eliminado]);

    return (
        <Wrapper>
            <Divider/>
            <br/>
            <SearchBar type="text" placeholder="Add a game that you enjoyed playing" value={search} onKeyDown={e => handleEnter(e)} onChange={ e => setSearch(e.target.value) }/>
            <Btn primary onClick={handleAddGame}>Add</Btn>
            <ListGames>
                <TituloList>Here are your picks:</TituloList>

                {chosenGames.length === 0 && (
                    <p>Nothing yet!</p>
                )}
                
                {chosenGames.length !== 0 && (
                    <Fragment>
                        <GameDetails>
                            <p><b>Title</b></p>
                            <p><b>Metacritic</b></p>
                            <p><b>Release Date</b></p>
                            <p><b>Remove</b></p>
                        </GameDetails>
                        <Divider/>
                        <Next><Link to={"/Recommendations?genres="+genres.slice(0, genres.length - 1)}><i className="fas fa-chevron-right"></i></Link></Next>
                    </Fragment>
                )}

                {chosenGames.map((games, index) => (
                    <GameDetails key={index} style={{color: "#66fcf1"}}>
                        <p>{games.name}</p>
                        <p>{games.metacritic ? games.metacritic : "N/A"}</p>
                        <p>{games.released ? games.released : "N/A"}</p>
                        <p><i style={{color: "red"}} className="fas fa-times" onClick={() => removeGame(index)}></i></p>
                    </GameDetails>
                ))}
            </ListGames>
            <div className="footer">Powered by <a style={{color: "#66fcf1"}} target="_blank" rel="noopener noreferrer" href="https://rawg.io/">Rawg.io.</a> Made by <a style={{color: "#66fcf1"}} target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></div>
        </Wrapper>
    );
}

export {
    AddGame,
    Btn,
    TituloList
};