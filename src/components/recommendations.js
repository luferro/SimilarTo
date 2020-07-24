import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import ReactTooltip from "react-tooltip";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Btn, TituloList } from './search';

toast.configure();

const Wrapper = styled.div`
    width: 70%;
    margin: 0 auto;
`;

const WrapperCollapsible = styled.div`
    width: inherit;
`;

const Sub = styled.h4`
    text-align: center;
    color: #66fcf1;
    font-family: PT Sans Narrow; 
    font-size: 20px;
`;

const TagSelector = styled.div`
    width: 100%;
    display: grid !important;
    grid-template-columns: 24% 24% 24% 24%;
    grid-gap: 10px;
    font-size: 15px;
    @media (max-width: 768px) {
        grid-template-columns: 100%;
    }
`;

const Tags = styled.span`
    color: white;
    cursor: pointer;
    background-color: #228B22;
    padding: 1rem;
    &.removed{
        background-color: #ff0000;
    }
`;

const Back = styled.button`
    background: transparent;
    position: fixed;
    padding: 1rem;
    top: 50%;
    height: 45px;
    left: 0;
    color: white;
    border: none;
    font-size: 40px;
    &:hover i{
        color: #66fcf1;
    }
`;

const Divider = styled.hr`
    width: 100%;
    color: white;
`;

const Collapsible = styled.section`
    width: 100%;
    margin: 0 auto;
    padding: 1rem 0rem;
    border-bottom: 2px solid white;
    font-family: PT Sans Narrow; 
    font-size: 20px;
    &.toggled div{
        display:block;
    }
    &.toggled .details{
        color: #66fcf1;
    }
    &.toggled a{
        color: #66fcf1;
    }
    @media (max-width: 768px) {
        height: 10%;
    }
`;

const Content = styled.div`
    width: 100%;
    height: fit-content;
    color: white;
    display: none;
`;

const Details = styled.div`
    width: 100%;
    color: white;
    display: grid !important;
    text-align:center;
    margin-top: 2%;
    grid-template-columns: 25% 75%;
    font-family: PT Sans Narrow; 
    font-size: 20px;
    @media (max-width: 768px) {
        grid-template-columns: 100%;
    }
`;

function Recommendations() {
    //Retrieve genres
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const genres = urlParams.get('genres');

    const [games, setGames] = useState([]);
    const [tags, setTags] = useState([]);
    const [selected, setSelected] = useState(genres.split(","));
    const [update, setUpdate] = useState(false);

    //Toggle collapsible
    const handleCollapsible = (id) => {
        let collapsible = document.getElementById("item-"+id);
        collapsible.classList.toggle("toggled");

        document.getElementById("item-"+id).classList.contains('toggled') ? document.getElementById("collapsible-icon-"+id).className = "fas fa-arrow-up" : document.getElementById("collapsible-icon-"+id).className = "fas fa-arrow-down";
    }

    const handleOnChangeCheckBox = (index) => {
        let tagSelector = document.getElementById("tag-"+index);
        tagSelector.classList.toggle("removed");

        document.getElementById("tag-"+index).classList.contains('removed') ? setSelected(selected.filter(tag => (tag !== tags[index]))) : setSelected(selected.concat(tags[index]))
        
    }
  
    const handleTags = () => {    
        setUpdate(true);
        if(selected.length === 0) toast.error("At least one tag must be selected.", { position: "bottom-right" })
    }

    //Request to Rawg API passing the wanted tags
    async function getGames() {
        const res = await fetch("https://api.rawg.io/api/games?tags="+selected.toString().toLowerCase()+"&page="+Math.floor((Math.random() * 10) + 1));
        const GamesArray = await res.json();
        setGames(GamesArray.results);
    }

    //Set tags received on the url into the Tags state and execute the request on mount
    useEffect(() => {
        setUpdate(false);
        if(tags.length === 0)
            setTags(genres.split(","));
        getGames();
    }, [update]);

    return (
        <Wrapper>
            <Back><Link to="/"><i className="fas fa-chevron-left"></i></Link></Back>
            <Divider/>
            <Sub>
                Here are your 20 game recommendations based on the following tags: 
                &nbsp;
                <i data-tip data-for="tagtip" className="far fa-question-circle"></i>
                <ReactTooltip id="tagtip" type="info" className="tooltip">
                    <h4>You can add or remove these tags by clicking on them.</h4>
                    <h4><span style={{color: "#228B22"}}>Green</span> = Tag selected.</h4>
                    <h4><span style={{color: "#ff0000"}}>Red</span> = Tag not selected.</h4>
                </ReactTooltip>
                <br/><br/>
                <TagSelector>
                    {tags.map((tags_chosen, index) => (
                        <Tags key={index} onClick={() => handleOnChangeCheckBox(index)} id={"tag-"+index}>
                            {tags_chosen} &nbsp; 
                        </Tags>
                    ))}
                </TagSelector>
                <Btn secondary onClick={() => handleTags()}>Update tags/recommendations</Btn>
            </Sub>
            <Divider/>
            {games ? games.map(games => (
                <Collapsible id={"item-"+games.id} key={games.id}>
                    <WrapperCollapsible onClick={() => handleCollapsible(games.id)}>
                        <a href={"#item-"+games.id}><b>{games.name}</b> <i style={{float: "right"}} id={"collapsible-icon-"+games.id} className="fas fa-arrow-down"></i></a>
                    </WrapperCollapsible>
                    <Content>
                        <Details>
                            <div>
                                <p><b>Available on:</b></p>
                                {(games.parent_platforms).map((platformsarray, index) => (
                                    <p key={index} className="details">{platformsarray.platform.name}</p>                            
                                ))}
                            </div>
                            { games.clip ?
                                <video style={{width:"100%"}} controls>
                                    <source src={games.clip.clip} type="video/mp4"/>
                                    Your browser does not support the video tag.
                                </video> 
                                :
                                <h3 className="details">No video available.</h3>
                            }
                            <div style={{textAlign: "left", marginLeft: "5%"}}>
                                <p><b>Metacritic Score:</b></p>
                                <p className="details">{games.metacritic ? games.metacritic + "/100" : "N/A"}</p>
                            </div>
                            <div style={{textAlign: "right", marginRight: "2%"}}>
                                <p><b>Release Date:</b></p>
                                <p className="details">{games.released ? games.released : "N/A"}</p>
                            </div>
                        </Details>
                    </Content>
                </Collapsible>
            ))
            :
            <TituloList>Include at least one tag.</TituloList>
            }         
            <div className="footer">Powered by <a style={{color: "#66fcf1"}} target="_blank" rel="noopener noreferrer" href="https://rawg.io/">Rawg.io</a>. Made by <a style={{color: "#66fcf1"}} target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></div>
        </Wrapper>
    );
}

export default Recommendations;