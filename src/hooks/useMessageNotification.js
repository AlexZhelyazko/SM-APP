import { useEffect, useState } from "react";

const useMessageNotification = (userId) => {
  const [messages, setMessages] = useState([]);
  const [notificationsSocket, setNotificationsSocket] = useState(null);

  // Функция для отправки сообщений
  const sendMessage = (message) => {
    if (
      notificationsSocket &&
      notificationsSocket.readyState === WebSocket.OPEN
    ) {
      notificationsSocket.send(message);
    }
  };

  useEffect(() => {
    const newNotificationsSocket = new WebSocket(
      "ws://localhost:7000/notifications-socket"
    );
    setNotificationsSocket(newNotificationsSocket);

    newNotificationsSocket.onopen = () => {
      console.log("WebSocket connection for notifications established!");
      // Регистрация текущего пользователя
      const registrationMessage = {
        type: "register",
        userId: userId,
      };
      newNotificationsSocket.send(JSON.stringify(registrationMessage));
    };

    newNotificationsSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prevMsg) => [...prevMsg, data]);
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    newNotificationsSocket.onclose = () => {
      console.log("WebSocket connection for notifications closed");
    };

    return () => {
      // Закрыть соединение при размонтировании компонента
      if (newNotificationsSocket) {
        newNotificationsSocket.close();
      }
    };
  }, [userId]);

  return { messages, sendMessage };
};

export default useMessageNotification;
