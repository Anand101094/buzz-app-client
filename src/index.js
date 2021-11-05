import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { io } from "socket.io-client";

import './index.scss'

// window.socket = io("http://localhost:3000");
window.socket = io("https://heroku-buzz-app.herokuapp.com");

ReactDOM.render(<App />, document.getElementById("app"));
