import { useEffect, useState } from "react";
import { makeRequest } from "../axios";

const useSendMessage = (senderId, recipientId, dialogId) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [dialogs, setDialogs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!dialogId && !recipientId && senderId) {
      async function init() {
        const response = await makeRequest.get(
          `/dialogs/getDialogs?user_id=${senderId}`
        );
        setDialogs(response.data);
      }
      init();
    } else {
      const checkUserInDialog = async () => {
        try {
          const response = await makeRequest.get(
            `/dialogs/checkUser?user_id=${senderId}&dialog_id=${dialogId}`
          );

          if (response.data.userExists) {
            const messagesResponse = await makeRequest.get(
              `/dialogs/getMessages?dialog_id=${dialogId}`
            );
            setMessages(messagesResponse.data);
          } else {
            setError(true);
          }
        } catch (error) {
          console.error("Произошла ошибка при выполнении запроса:", error);
          setError(true);
        }
      };
      checkUserInDialog();
    }
  }, [dialogId]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageData = {
        type: "message",
        senderId: senderId,
        recipientId: recipientId,
        text: message,
        dialogId: dialogId,
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
        if (!dialogId && !recipientId && senderId) {
          setDialogs((prevDialogs) =>
            prevDialogs.map((dialog) => {
              if (dialog.dialog_id === +data.dialogId) {
                return {
                  dialog_id: data.dialogId,
                  last_message_time: data.timestamp,
                  message_text: data.message_text,
                  other_username: dialog.other_username,
                };
              } else {
                return dialog;
              }
            })
          );
        } else {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
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

  return { messages, sendMessage, dialogs, error };
};

export default useSendMessage;
