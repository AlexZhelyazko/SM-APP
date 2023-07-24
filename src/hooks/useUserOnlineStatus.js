import { useEffect, useState } from "react";

// Кастомный хук для запроса статуса пользователя
const useUserOnlineStatus = (webSocket, currentUserId) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnMessage = (message) => {
      const data = JSON.parse(message);
      if (data.type === "online-status" && data.userId === currentUserId) {
        setIsOnline(data.isOnline);
      }
    };

    webSocket.onMessage(handleOnMessage);
    webSocket.connect();

    return () => {
      webSocket.disconnect();
    };
  }, [currentUserId, webSocket]);

  return isOnline;
};

export default useUserOnlineStatus;
