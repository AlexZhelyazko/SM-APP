import { useEffect, useState } from "react";
import { makeRequest } from "../axios";

const useDialogs = (userId) => {
  const [socket, setSocket] = useState(null);
  const [dialogs, setDialogs] = useState([]);

  useEffect(() => {
    async function init() {
      const response = await makeRequest.get(
        `/dialogs/getDialogs?user_id=${userId}`
      );
      setDialogs(response.data);
    }
    init();
  }, []);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:6000");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connection for dialogs established!");

      newSocket.send(JSON.stringify({ type: "register" }));
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDialogs((oldDialogs) => [...oldDialogs, data]);
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

  return { dialogs, setDialogs };
};

export default useDialogs;
