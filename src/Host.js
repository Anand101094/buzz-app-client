import React, { useEffect, useState } from "react";
import Buzz from "../public/resources/mixkit-game-show-buzz-in-3090.wav";

const Host = ({ users }) => {
  const [roomId, setRoomId] = useState(undefined);
  const [copyText, setCopyText] = useState(false);
  const [firstBuzz, setFirstBuzz] = useState(false);

  const audio = new Audio(Buzz);

  useEffect(() => {
    // make the api call and get the Room ID
    // fetch("http://localhost:3000/host")
      fetch("https://heroku-buzz-app.herokuapp.com/host")
      .then((res) => res.json())
      .then((data) => {
        setRoomId(data.roomId.toString());
        const socketData = {
          roomId: `${data.roomId}`,
          userData: {
            userId: socket.id,
            userName: "Host",
            joinedRoom: data.roomId.toString(),
            host: true,
          },
        };

        // if socketid is available, join the room
        if (socket.id) {
          socket.emit("create_room", socketData);
        } else {
          // else wait for the connection and join the room
          socket.on("connect", () => {
            socket.emit("create_room", socketData);
          });
        }
      });
    socket.on("buzzer_clicked", () => {
      audio.play();
    });
  }, []);

  useEffect(() => {
    if (copyText) {
      setTimeout(() => setCopyText(false), 1000);
    }
  }, [copyText]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopyText(true);
  };

  const createRankedList = (clientList) => {
    const rankedList = {};
    if (clientList.length) {
      clientList.forEach((client, i) => {
        rankedList[client.userId] = i;
      });
    }
    return rankedList;
  };

  const connectedClients = users.filter((user) => user.userId !== socket.id);
  const buzzedClients = connectedClients
    .filter((user) => user.timeStamp)
    .sort((a, b) => {
      return a.timeStamp - b.timeStamp;
    });

  const rankedList = createRankedList(buzzedClients);
  return (
    <div className="host-screen">
      {roomId && (
        <div className="roomId">
          <span>Room ID:</span>
          <span title="click to copy" className="copy__roomId">
            {roomId}
          </span>
          <span onClick={copyToClipboard} className="copy-to-clipboard__text">
            {copyText ? "Copied boss!" : "Click to copy"}
          </span>
        </div>
      )}

      <div className="buzz-btn__container">
        <button
          onClick={() => socket.emit("reset_buzzers", { roomId })}
          className="btn teal waves-effect waves-light"
        >
          Reset Buzz
        </button>

        <button
          onClick={() => {
            setFirstBuzz(!firstBuzz);
            if(firstBuzz) {
              socket.emit("first_buzz_deactivate", { roomId });
            } else {
              socket.emit("first_buzz_activate", { roomId });
            }
          }}
          className={`btn ${firstBuzz ? "red" : "teal"}`}
        >
          First Buzz
        </button>
      </div>

      {connectedClients.length === 0 && (
        <div className="client-not-connected__text">
          <div>Hey!!! What's up. How you doin? No one's in the room YET. </div>
          <div>
            Okay... Don't worry, just share the Room Id and let them join.
          </div>
        </div>
      )}

      <div className="container host-screen__container">
        <div className="connected-clients__container">
          {connectedClients.length !== 0 && <h5>Connected Users</h5>}
          {connectedClients.length !== 0 && (
            <div className="connected-clients__list">
              {connectedClients.map((client) => {
                const rank = rankedList[client.userId];
                return (
                  <div key={client.userId} className="client">
                    <span
                      className={`buzz-status ${
                        rank !== undefined ? "" : "hide"
                      }`}
                    >
                      <span className="buzz-rank">{rank + 1 || ""}</span>
                    </span>
                    <span className="client-name">{client.userName}</span>
                    <span
                      className="remove-client"
                      title="Kick out"
                      onClick={() =>
                        socket.emit("kick_player", {
                          roomId,
                          socketId: client.userId,
                        })
                      }
                    >
                      <i className="material-icons remove-icon">remove</i>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Host;
