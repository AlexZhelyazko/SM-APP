import React from "react";
import "./chat.scss";
import { useQuery } from "react-query";

const Chat = () => {
  return (
    <div className="chat">
      <div className="header">
        <div className="chat__header-image"></div>
        <div className="companion-info">
          <span>Name</span>
          <span>Status</span>
        </div>
      </div>
      <div className="messages">
        <div>
          <span>Hello</span>
          <span>date</span>
        </div>
        <div>
          <span>Hello</span>
          <span>date</span>
        </div>
      </div>
      <div className="form">
        <input type="text" placeholder="Type..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default Chat;
