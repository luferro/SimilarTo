import React, { Fragment } from 'react';
import {  BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from 'styled-components';
import { AddGame } from './components/search';
import './App.css';
import Recommendations from './components/recommendations';

const Titulo = styled.h2`
  text-align: center;
  font-family: Monospace cursive !important;
  font-size: 40px;
  font-style: italic;
  font-weight: 800;
  color: #66fcf1;
`;

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/" exact component={SearchGame} />
          <Route path="/Recommendations" exact component={GamesSimilar} />
      </Switch>
    </Router>
  );
}

export default App;

function SearchGame() {
  return (
    <Fragment>
      <Titulo>SimilarTo</Titulo>
      <AddGame />
    </Fragment>
  );
}

function GamesSimilar() {
  return (
    <Fragment>
      <Titulo>SimilarTo</Titulo>
      <Recommendations />
    </Fragment>
  );
}

