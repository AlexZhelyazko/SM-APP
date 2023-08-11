import { useEffect, useState } from "react";

const useOnlineUsersStatus = (userId) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8888");

    socket.onopen = () => {
      console.log("WebSocket connection established!");
      socket.send(JSON.stringify({ type: "user-id", userId })); // Отправляем сообщение с ID пользователя
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === "online-status-update") {
          setOnlineUsers(data.onlineUsers);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return onlineUsers;
};

export default useOnlineUsersStatus;
