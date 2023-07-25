import React, { useEffect, useState } from "react";

const useOnlineStatus = (userId) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8888");

    socket.onopen = () => {
      console.log("WebSocket connection established!");

      const userIdMessage = JSON.stringify({ type: "user-id", userId });
      socket.send(userIdMessage);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "online-status" && data.userId === userId) {
          setIsOnline(data.isOnline);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Отключаем WebSocket соединение при размонтировании компонента
    return () => {
      socket.close();
    };
  }, [userId]);

  return isOnline;
};

export default useOnlineStatus;
