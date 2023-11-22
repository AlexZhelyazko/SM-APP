import React, { useContext } from "react";
import "./messages.scss";
import { AuthContext } from "../../context/authContext";
import useDialogs from "../../hooks/useDialogs";
import useSendMessage from "../../hooks/useSendMessages";

const Dialogs = () => {
  const { currentUser } = useContext(AuthContext);
  const { dialogs } = useSendMessage(currentUser.id);
  console.log(dialogs);
  return (
    <div className="dialogs">
      {dialogs.map((dialog) => {
        return (
          <div>
            {dialog.other_username} <span>{dialog.message_text}</span>{" "}
            <span className="message_time">
              {new Date(dialog.last_message_time)
                .toLocaleTimeString({
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
                .slice(0, 5)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Dialogs;
