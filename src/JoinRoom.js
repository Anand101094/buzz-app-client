import React, { useState, useEffect } from "react";

const JoinRoom = ({ users }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);
  const [disable, setDisable] = useState(false);

  const audio = new Audio(
    "./public/resources/mixkit-game-show-buzz-in-3090.wav"
  );

  useEffect(() => {
    socket.on("buzzer_reset", () => {
      setDisable(false);
    });

    socket.on("host_disconected", () => {
      setRoomJoined(false);
    });
  }, []);

  const joinRoom = () => {
    socket.emit("join_room", {
      roomId: roomId,
      userData: {
        userId: socket.id,
        userName: name,
        joinedRoom: roomId,
      },
    });

    setRoomJoined(true);
  };

  const sendBuzzer = () => {
    // disable button
    setDisable(true);

    // send timestamp data
    const timeStamp = Date.now();
    socket.emit("send_buzzer", {
      roomId: roomId,
      userData: {
        userId: socket.id,
        userName: name,
        joinedRoom: roomId,
        timeStamp,
      },
    });

    audio.play();
  };

  if (!roomJoined) {
    return (
      <div className="joining-room">
        <h5>Join Room</h5>
        <div className="room-id__textbox">
          <input
            type="text"
            value={roomId}
            placeholder="Room ID"
            onChange={(e) => setRoomId(e.target.value)}
          ></input>
        </div>
        <div className="username__textbox">
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <button onClick={joinRoom} className="btn pink">
          Join
        </button>
      </div>
    );
  } else {
    return (
      <div className="players-view">
        {users.length && <span>{users.length} people connected</span>}
        {
          <div className="buzz-button">
            <button
              disabled={disable}
              onClick={disable ? () => {} : sendBuzzer}
              className="btn red"
            >
              {disable ? "Buzzed" : "Click the Buzzer"}
            </button>
          </div>
        }
      </div>
    );
  }
};

export default JoinRoom;
