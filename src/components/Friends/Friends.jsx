import "./Friends.scss";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { NavLink } from "react-router-dom";
import { Loader } from "../Loader/Loader";
import useDebounce from "../../hooks/useDebounce";

export const Friends = ({ onlineUsers }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 1000); // Используйте debounce для задержки

  const { currentUser } = useContext(AuthContext);

  const { isLoading, data: followings } = useQuery(["relationship"], () =>
    makeRequest.get("/friends?followerUserId=" + currentUser.id).then((res) => {
      return res.data;
    })
  );

  // Фильтруем друзей на клиентской стороне
  const filteredFollowings = followings.filter((el) =>
    el.name.toLowerCase().includes(debouncedValue.toLowerCase())
  );

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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
