import React, { useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// import { } from 'react-router-dom'
import Home from "./pages/Home";
import Game from "./pages/Game";
function App() {
  console.log('Router',Route)
  return (
    // <div></div>
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/game/:gameCode/:roomId" component={Game} />
      </Switch>
    </Router>
  );
}

export default App;
