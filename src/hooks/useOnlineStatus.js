import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useOnlineUsersStatus = (userId) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const location = useLocation();

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  useEffect(() => {
    if (
      !userId ||
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    ) {
      return; // Ignore the hook on login and register pages
    }

    const newSocket = new WebSocket("ws://localhost:8888");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connection established!");
      newSocket.send(JSON.stringify({ type: "user-id", userId }));
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "online-status-update") {
          setOnlineUsers(data.onlineUsers);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    const handleLogoutOrClose = () => {
      newSocket.send(JSON.stringify({ type: "user-logout", userId }));
      newSocket.close();
    };

    window.addEventListener("beforeunload", handleLogoutOrClose);
    return () => {
      window.removeEventListener("beforeunload", handleLogoutOrClose);
      newSocket.close();
    };
  }, []);

  return { onlineUsers, sendMessage, socket };
};

export default useOnlineUsersStatus;
