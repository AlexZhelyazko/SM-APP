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
            {dialog.other_username} <span>{dialog.message_text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Dialogs;
