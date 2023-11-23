import React, { useContext } from "react";
import "./messages.scss";
import { AuthContext } from "../../context/authContext";
import useDialogs from "../../hooks/useDialogs";
import useSendMessage from "../../hooks/useSendMessages";
import { NavLink } from "react-router-dom";

const Dialogs = () => {
  const { currentUser } = useContext(AuthContext);
  const { dialogs } = useSendMessage(currentUser.id);

  // const getUserInfo = async () => {
  //   try {
  //     const response = await makeRequest.get(`/users/find/${currentUser.id === dialogs.user1_id ? dialogs.user2_id : dialogs.user1_id}`);
  //     setRecepientInfo(response.data);
  //   } catch (error) {
  //     console.error("Произошла ошибка при выполнении запроса:", error);
  //   }
  // };
  // useEffect(() => {
  //   if (dialogs.user1_id && dialogs.user2_id) {
  //     getUserInfo();
  //   }
  // }, [dialogs.user1_id, dialogs.user2_id]);
  console.log(dialogs);
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
                <div>DELETE</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Dialogs;
