import React, { useEffect, useState } from "react";

const Host = ({ users }) => {
  const [roomId, setRoomId] = useState(undefined);

  const audio = new Audio(
    "./public/resources/mixkit-game-show-buzz-in-3090.wav"
  );

  useEffect(() => {
    // make the api call and get the Room ID
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
        }

        // if socketid is available, join the room
        if (socket.id) {
          socket.emit("join_room", socketData);
        } else {
          // else wait for the connection and join the room
          socket.on("connect", () => {
            socket.emit("join_room", socketData);
          });
        }
      });
    socket.on("buzzer_clicked", (data) => {
      audio.play();
    });
  }, []);

  const connectedClients = users.filter((user) => user.userId !== socket.id);
  console.log(connectedClients);
  const buzzedClients = connectedClients
    .filter((user) => user.timeStamp)
    .sort((a, b) => {
      return a.timeStamp - b.timeStamp;
    });

  return (
    <div className="host-screen">
      <h5>Host screen</h5>
      {roomId && <div className="roomId">{`Room Id : ${roomId}`}</div>}
      {buzzedClients.length !== 0 && (
        <div className="reset__buzzer-btn">
          <button
            onClick={() => socket.emit("reset_buzzers", { roomId })}
            className="btn red"
          >
            Reset Buzzers
          </button>
        </div>
      )}
      <div className="container host-screen__container">
        <div className="connected-clients">
          {connectedClients.length !== 0 && <h5>Connected Users</h5>}
          {connectedClients &&
            connectedClients.map((client) => {
              return (
                <div key={client.userId} className="client">
                  {client.userName}
                </div>
              );
            })}
        </div>
        <div className="buzzed-clients">
          {buzzedClients.length !== 0 && <h5>Buzzed Users</h5>}
          {buzzedClients &&
            buzzedClients.map((client) => {
              return (
                <div key={client.userId} className="client">
                  {client.userName}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Host;
