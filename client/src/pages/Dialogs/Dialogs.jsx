import React, { useContext } from "react";
import "./messages.scss";
import { AuthContext } from "../../context/authContext";
import useDialogs from "../../hooks/useDialogs";
import useSendMessage from "../../hooks/useSendMessages";
import { NavLink } from "react-router-dom";
import { makeRequest } from "../../axios";

const Dialogs = () => {
  const { currentUser } = useContext(AuthContext);
  const { dialogs } = useSendMessage(currentUser.id);
  const handleDelete = async (dialog_id) => {
    await makeRequest.delete(`/dialogs/deleteDialog?dialog_id=${dialog_id}`);
  };

  return (
    <div className="dialogs">
      {dialogs.map((dialog) => {
        return (
          <div className="dialog_wrapper">
            {dialog.last_message_id && (
              <>
                {" "}
                <NavLink to={`/dialogs/${dialog.dialog_id}`} className="dialog">
                  <div className="user_img">
                    <img
                      src={
                        dialogs.profilePic
                          ? "/upload/" + dialogs.profilePic
                          : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                      }
                      alt=""
                      srcset=""
                    />
                  </div>
                  <div className="username"> {dialog.other_username}</div>
                  <div className="last_message">{dialog.message_text}</div>{" "}
                  <div className="message_time">
                    {new Date(dialog.last_message_time)
                      .toLocaleTimeString({
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                      .slice(0, 5)}
                  </div>
                </NavLink>
                <div onClick={() => handleDelete(dialog.dialog_id)}>DELETE</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Dialogs;
