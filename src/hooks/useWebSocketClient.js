import { useEffect, useRef, useCallback } from "react";

const useWebSocketClient = (url) => {
  const webSocketRef = useRef(null);

  const connect = useCallback(() => {
    // Create a new WebSocket instance
    webSocketRef.current = new WebSocket(url);

    // Handle WebSocket connection events
    webSocketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    webSocketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    webSocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [url]);

  useEffect(() => {
    connect();

    // Clean up the WebSocket connection on unmount
    return () => {
      webSocketRef.current.close();
    };
  }, [connect]);

  // Helper functions to interact with the WebSocket

  const send = useCallback((data) => {
    if (
      webSocketRef.current &&
      webSocketRef.current.readyState === WebSocket.OPEN
    ) {
      webSocketRef.current.send(JSON.stringify(data));
    }
  }, []);

  const onMessage = useCallback((callback) => {
    webSocketRef.current.onmessage = (event) => {
      callback(event.data);
    };
  }, []);

  const disconnect = useCallback(() => {
    webSocketRef.current.close();
  }, []);

  return {
    connect,
    send,
    onMessage,
    disconnect,
  };
};

export default useWebSocketClient;
