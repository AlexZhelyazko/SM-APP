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
        <div className="message_recepient">
          <span className="message_text">Hello</span>
          <span className="message_date">date</span>
        </div>
        <div className="message_receiver">
          <span className="message_text">
            HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello
          </span>
          <span className="message_date">date</span>
        </div>
        <div className="message_recepient">
          <span className="message_text">Hello</span>
          <span className="message_date">date</span>
        </div>
        <div className="message_recepient">
          <span className="message_text">Hello</span>
          <span className="message_date">date</span>
        </div>
        <div className="message_recepient">
          <span className="message_text">Hello</span>
          <span className="message_date">date</span>
        </div>
        <div className="message_receiver">
          <span className="message_text">
            HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello
          </span>
          <span className="message_date">date</span>
        </div>
        <div className="message_recepient">
          <span className="message_text">Hello</span>
          <span className="message_date">date</span>
        </div>
        <div className="message_receiver">
          <span className="message_text">
            HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello
          </span>
          <span className="message_date">date</span>
        </div>
      </div>
      <div className="form">
        <textarea
          className="chat_input"
          name="chat_input"
          id=""
          cols="30"
          rows="3"
          placeholder="Type..."
        ></textarea>
        {/* <input className="chat_input" type="text" placeholder="Type..." /> */}
        <button className="chat_btn">Send</button>
      </div>
    </div>
  );
};

export default Chat;
