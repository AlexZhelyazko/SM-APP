import { useEffect, useRef } from "react";

const useWebSocketClient = (url) => {
  const webSocketRef = useRef(null);

  useEffect(() => {
    webSocketRef.current = new WebSocket(url);

    return () => {
      webSocketRef.current.close();
    };
  }, [url]);

  const connect = () => {
    webSocketRef.current && webSocketRef.current.open();
  };

  const disconnect = () => {
    webSocketRef.current && webSocketRef.current.close();
  };

  const onMessage = (callback) => {
    webSocketRef.current &&
      webSocketRef.current.addEventListener("message", (event) => {
        callback(event.data);
      });
  };

  return { connect, disconnect, onMessage };
};

export default useWebSocketClient;
