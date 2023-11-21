import { useEffect, useState } from "react";
import { makeRequest } from "../axios";

const useSendMessage = (senderId, recipientId, dialogId) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [dialogs, setDialogs] = useState([]);
  // useEffect(() => {
  //   async function init() {
  //     const response = await makeRequest.get(
  //       `/dialogs/getDialogs?user_id=${senderId}`
  //     );
  //     setDialogs(response.data);
  //   }
  //   init();
  // }, []);
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
      async function init() {
        const response = await makeRequest.get(
          `/dialogs/getMessages?dialog_id=${dialogId}`
        );
        setMessages(response.data);
      }
      init();
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
        console.log(data);
        if (!dialogId && !recipientId && senderId) {
          setDialogs((prevDialogs) =>
            prevDialogs.map((dialog) => {
              console.log(dialog.dialog_id === +data.dialogId);
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
        // setDialogs((prevDialogs) => [...prevDialogs, data])
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

  return { messages, sendMessage, dialogs };
};

export default useSendMessage;
