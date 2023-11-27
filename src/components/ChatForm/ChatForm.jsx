import { useState } from "react";

const ChatForm = ({ sendMessage, scrollToBottomSmoothly }) => {
  const [message, setMessage] = useState("");
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
      scrollToBottomSmoothly();
    }
  };
  return (
    <div className="form">
      <textarea
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="chat_input"
        name="chat_input"
        id=""
        cols="30"
        rows="3"
        placeholder="Enter your message..."
      ></textarea>
      <button className="chat_btn" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatForm;
