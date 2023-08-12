import "./Friends.scss";
import { useContext } from "react";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { NavLink } from "react-router-dom";
import { Loader } from "../Loader/Loader";

export const Friends = ({ onlineUsers }) => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, data: followings } = useQuery(["relationship"], () =>
    makeRequest.get("/friends?followerUserId=" + currentUser.id).then((res) => {
      return res.data;
    })
  );

  console.log(followings);

  if (isLoading) return <Loader />;
  return (
    <div className="followings">
      {followings?.map((el) => {
        return (
          <div className="following">
            <NavLink to={`/profile/${el.followedUserId}`}>
              <img
                src={
                  el.profilePic
                    ? "/upload/" + el.profilePic
                    : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                }
                alt=""
              />
            </NavLink>
            {onlineUsers.includes(+el.followedUserId) ? (
              <div className="onlineStatus"></div>
            ) : (
              ""
            )}
            <div className="followingInfo">
              <div>{el.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
