import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Host from "./Host";
import JoinRoom from "./JoinRoom";

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("new_user_connection", (data) => {
      setUsers([...data]);
    });

    socket.on("user_disconected", (data) => {
      setUsers([...data]);
    });

    socket.on("buzzer_clicked", (data) => {
      setUsers([...data]);
    });

    socket.on("host_disconected", () => {
      setUsers([]);
    });

    socket.on("buzzer_reset", (data) => {
      setUsers([...data]);
    });
  }, []);

  return (
    <div className="main-app center">
      <nav className="navbar">
        <h4 className="nav-header">Buzzzinga !!!</h4>
      </nav>
      <div className="buzz-app__container">
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <div className="host-play__btn-container">
                <Link to="/host">
                  <button className="btn">Host Buzz Room</button>
                </Link>
                <Link to="/join_room">
                  <button className="btn">Join Buzz Room</button>
                </Link>
              </div>
            </Route>
            <Route path="/host" exact>
              <Host users={users} />
            </Route>
            <Route path="/join_room" exact>
              <JoinRoom users={users} />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
