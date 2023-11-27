import "./Friends.scss";
import { useContext, useState } from "react";

import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { NavLink, Navigate, redirect, useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import useDebounce from "../../hooks/useDebounce";

export const Friends = ({ onlineUsers }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 500);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const { isLoading, data: followings } = useQuery(["relationship"], () =>
    makeRequest.get("/friends?followerUserId=" + currentUser.id).then((res) => {
      return res.data;
    })
  );

  const filteredFollowings = followings?.filter((el) =>
    el?.name?.toLowerCase().includes(debouncedValue.toLowerCase())
  );

  const handleStartChat = async (userId) => {
    try {
      // Отправляем запрос на сервер, чтобы проверить существующий диалог
      const response = await makeRequest.get(
        `/dialogs/check?user1_id=${currentUser.id}&user2_id=${userId}`
      );

      if (response.data.dialogExists) {
        // Диалог существует, переходим к нему
        navigate(`/dialogs/${response.data.dialogId}`);
        //return redirect(`/dialog/${response.data.dialog_id}`);
        //history.push(`/dialog/${response.data.dialogId}`);
      } else {
        // Диалог не существует, создаем новый
        const createDialogResponse = await makeRequest.post("/dialogs/create", {
          user1_id: currentUser.id,
          user2_id: userId,
        });
        // Обработка успешного создания диалога
        navigate(`/dialogs/${createDialogResponse.data.dialog_id}`);
        //return redirect(`/dialog/${createDialogResponse.data.dialog_id}`);
        //history.push(`/dialog/${createDialogResponse.data.dialogId}`);
      }
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при обработке диалога:", error);
    }
  };

  if (isLoading) return <Loader />;
  return (
    <div className="followings">
      <input
        className="followings__findInput"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Find"
      />
      <div>
        {filteredFollowings.map((el) => {
          return (
            <div className="following">
              <NavLink to={`/profile/${el.followedUserId}`}>
                <div style={{ position: "relative" }}>
                  <img
                    src={
                      el.profilePic
                        ? "/upload/" + el.profilePic
                        : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                    }
                    alt=""
                  />
                  {onlineUsers.includes(+el.followedUserId) ? (
                    <div className="onlineStatus"></div>
                  ) : (
                    ""
                  )}
                </div>
              </NavLink>

              <div className="followingInfo">
                <div>{el.name}</div>
                <button
                  onClick={() => handleStartChat(el.followedUserId)}
                  className="followingInfo_textBtn"
                >
                  Text
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
