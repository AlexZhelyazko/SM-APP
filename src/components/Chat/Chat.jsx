import React, { useEffect, useContext, useState } from "react";
import "./chat.scss";
import { useQuery } from "react-query";
import useSendMessage from "../../hooks/useSendMessages";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Chat = () => {
  const location = useLocation();
  let dialogId = location.pathname.match(/\d+/)[0];
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [sender_id, setSender_id] = useState(null);
  const [recepient_id, setRecepient_id] = useState(null);
  const { sendMessage, messages } = useSendMessage(
    currentUser.id,
    recepient_id,
    dialogId
  );
  console.log(messages);
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  const fetchData = async () => {
    try {
      const response = await makeRequest.get(
        `/dialogs/getIds?dialog_id=${dialogId}`
      );
      if (response.data.user1_id === currentUser.id) {
        setSender_id(response.data.user1_id);
        setRecepient_id(response.data.user2_id);
      } else {
        setSender_id(response.data.user2_id);
        setRecepient_id(response.data.user1_id);
      }
    } catch (error) {
      console.error("Произошла ошибка при выполнении запроса:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dialogId]);

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
        {messages.map((msg) => {
          return (
            <div
              className={
                currentUser.id === msg.sender_id
                  ? "message_recepient"
                  : "message_receiver"
              }
            >
              <span className="message_text">{msg.message_text}</span>
              <span className="message_time">
                {new Date(msg.timestamp)
                  .toLocaleTimeString({
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                  .slice(0, 5)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="form">
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="chat_input"
          name="chat_input"
          id=""
          cols="30"
          rows="3"
          placeholder="Type..."
        ></textarea>
        <button className="chat_btn" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
