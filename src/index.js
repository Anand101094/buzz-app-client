import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { io } from "socket.io-client";

import './index.scss'

window.socket = io("http://localhost:3000");

ReactDOM.render(<App />, document.getElementById("app"));
