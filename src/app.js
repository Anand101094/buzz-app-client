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
    <div className="main-app center container">
      <h4>Buzz App</h4>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <div className="host-play__btn-container">
              <Link to="/host">
                <button className="btn teal">Host</button>
              </Link>
              <Link to="/join_room">
                <button className="btn teal">Join</button>
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
  );
};

export default App;
