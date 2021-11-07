import React, { useState, useEffect } from "react";
// import setDragElement from "./util";
import Buzz from "../public/resources/mixkit-game-show-buzz-in-3090.wav";

const JoinRoom = ({ users }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);
  const [disableBuzzBtn, setDisableBuzzBtn] = useState(false);
  const [disableJoinBtn, setDisableJoinBtn] = useState(true);
  const [lockBuzzBtn, setLockBuzzBtn] = useState(false);

  const audio = new Audio(Buzz);

  useEffect(() => {
    socket.on("buzzer_reset", () => {
      setDisableBuzzBtn(false);
    });

    socket.on("host_disconected", () => {
      setRoomJoined(false);
    });

    socket.on("kicked_out", () => {
      setRoomJoined(false);
    });

    socket.on("room_joined", () => {
      setRoomJoined(true);
    });

    socket.on("invalid_room", () => {
      setRoomJoined(false);
      alert("Invalid Room");
    });

    socket.on("buzzer_locked_by", ({ socketId }) => {
      if (socket.id !== socketId) {
        setLockBuzzBtn(true);
      }
    });

    socket.on("buzzer_unlocked", () => {
      setLockBuzzBtn(false);
    });
  }, []);

  useEffect(() => {
    if (name && roomId) {
      setDisableJoinBtn(false);
    } else {
      setDisableJoinBtn(true);
    }
  }, [name, roomId]);

  // useEffect(() => {
  //   if (roomJoined) {
  //     const buzzBtn = document.getElementById("client-buzz-button");
  //     if (buzzBtn) {
  //       setDragElement(buzzBtn);
  //     }
  //   }
  // }, [roomJoined]);

  const joinRoom = () => {
    socket.emit("join_room", {
      roomId: roomId,
      userData: {
        userId: socket.id,
        userName: name,
        joinedRoom: roomId,
      },
    });
  };

  const sendBuzzer = () => {
    // disable button
    setDisableBuzzBtn(true);

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
        <button
          disabled={disableJoinBtn}
          onClick={disableJoinBtn ? () => {} : joinRoom}
          className="btn join-room__btn"
        >
          Join
        </button>
      </div>
    );
  } else {
    return (
      <div className="players-view">
        {users.length && (
          <span className="connected-people__text">
            {users.length} people connected
          </span>
        )}
        <div className="roomId">
          <span>Room ID:</span>
          <span title="click to copy" className="copy__roomId">
            {roomId}
          </span>
        </div>
        <div className="username_text">
          <span>My "Internet" name:</span>
          <span className="copy__roomId">{name}</span>
        </div>
        {
          <div className="buzz-button">
            <button
              id="client-buzz-button"
              disabled={disableBuzzBtn || lockBuzzBtn}
              onClick={disableBuzzBtn || lockBuzzBtn ? () => {} : sendBuzzer}
              className="btn btn-large"
            >
              {lockBuzzBtn ? "Locked" : disableBuzzBtn ? "Buzzed" : "Buzzer"}
            </button>
          </div>
        }
      </div>
    );
  }
};

export default JoinRoom;
