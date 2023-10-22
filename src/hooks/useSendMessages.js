import { useEffect, useState } from "react";
import { makeRequest } from "../axios";

const useSendMessage = (senderId, recipientId, dialogId) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function init() {
      const response = await makeRequest.get(
        `/dialogs/getMessages?dialog_id=${dialogId}`
      );
      setMessages(response.data);
    }
    init();
  }, [dialogId]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageData = {
        type: "message",
        senderId: senderId,
        recipientId: recipientId,
        text: message,
      };
      socket.send(JSON.stringify(messageData));
    }
  };

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:7000/chat-socket");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connection for chat established!");

      newSocket.send(JSON.stringify({ type: "register", userId: senderId }));
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection for chat closed");
    };

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  return { messages, sendMessage };
};

export default useSendMessage;
