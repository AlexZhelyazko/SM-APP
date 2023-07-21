import { useEffect, useState } from "react";

const webSocket = new WebSocket("ws://localhost:8080");

function OnlineStatusIndicator() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState(false); // Состояние для отслеживания онлайна/офлайна

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8800");

    newSocket.onopen = () => {
      console.log("WebSocket connected");
    };

    newSocket.onmessage = (event) => {
      // Обработка входящих сообщений от сервера
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setOnline(true); // При подключении, устанавливаем статус онлайн
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      setOnline(false); // При разъединении, устанавливаем статус офлайн
    };

    // Очистка соединения при размонтировании компонента
    return () => {
      newSocket.close();
    };
  }, []);

  // Обработчик отправки сообщения на сервер через веб-сокет
  const sendMessage = () => {
    if (socket) {
      socket.send(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div>
      <div>
        {online ? <h2>Status: Online</h2> : <h2>Status: Offline</h2>}
        <h2>WebSocket Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
