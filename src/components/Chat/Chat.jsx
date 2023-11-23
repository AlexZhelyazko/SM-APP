import React, { useEffect, useContext, useState, useRef } from "react";
import "./chat.scss";
import { useQuery } from "react-query";
import useSendMessage from "../../hooks/useSendMessages";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Chat = ({ onlineUsers }) => {
  const location = useLocation();
  let dialogId = location.pathname.match(/\d+/)[0];
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [sender_id, setSender_id] = useState(null);
  const [recepient_id, setRecepient_id] = useState(null);
  const [recepientInfo, setRecepientInfo] = useState(null);
  const [lastVisibleMessageDate, setLastVisibleMessageDate] = useState(null);
  const chatContainerRef = useRef(null);
  const { sendMessage, messages } = useSendMessage(
    currentUser.id,
    recepient_id,
    dialogId
  );
  console.log(messages);

  useEffect(() => {
    scrollToBottomSmoothly();
  }, [messages]); // Вызываем функцию прокрутки при обновлении сообщений

  useEffect(() => {
    const container = chatContainerRef.current;

    const handleScroll = () => {
      const messages = container.querySelectorAll(".message");
      let lastVisibleDate = null;

      messages.forEach((message) => {
        const rect = message.getBoundingClientRect();

        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          lastVisibleDate = message.dataset.timestamp;
        }
      });

      if (lastVisibleDate) {
        const messageDate = new Date(lastVisibleDate);
        const formattedDate = formatDate(messageDate);
        setLastVisibleMessageDate(formattedDate);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);
  const formatDate = (inputDate) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return inputDate.toLocaleDateString("en-US", options);
  };

  const scrollToBottomSmoothly = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
      scrollToBottomSmoothly();
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
  const getUserInfo = async () => {
    try {
      const response = await makeRequest.get(`/users/find/${+recepient_id}`);
      setRecepientInfo(response.data);
    } catch (error) {
      console.error("Произошла ошибка при выполнении запроса:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dialogId]);

  useEffect(() => {
    if (recepient_id) {
      getUserInfo();
    }
  }, [recepient_id]);

  console.log(recepientInfo);
  console.log(onlineUsers);
  return (
    <div className="chat">
      <div className="header">
        <div className="chat__header-image">
          <img
            src={
              recepientInfo?.profilePic
                ? "/upload/" + recepientInfo?.profilePic
                : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
            }
            alt=""
            srcset=""
          />
        </div>
        <div className="companion-info">
          <span>{recepientInfo?.name}</span>
          <span>
            {recepientInfo && onlineUsers.includes(recepientInfo.id)
              ? "Online"
              : "Offline"}
          </span>
        </div>
      </div>
      <div className="messages" ref={chatContainerRef}>
        <span className="messages_date">{lastVisibleMessageDate}</span>
        {messages.map((msg) => {
          return (
            <div
              className={
                currentUser.id === msg.sender_id
                  ? "message_recepient message"
                  : "message_receiver message"
              }
              data-timestamp={msg.timestamp}
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
          placeholder="Enter your message..."
        ></textarea>
        <button className="chat_btn" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
