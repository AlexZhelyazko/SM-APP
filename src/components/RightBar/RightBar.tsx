import "./rightbar.scss";
import { useContext } from "react";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import OnlineFriends from "../OnlineFriends/OnlineFriends";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { isLoading: relationshipLoading, data: relationshipData } = useQuery(
    ["relationshipSuggestions"],
    () =>
      makeRequest
        .get("/relationships/suggestions?followedUserId=" + currentUser.id)
        .then((res) => {
          return res.data;
        })
  );
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>Jane Doe</span>
            </div>
            <div className="buttons">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>Jane Doe</span>
            </div>
            <div className="buttons">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
        </div>
        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>
        <OnlineFriends />
      </div>
    </div>
  );
};

export default RightBar;
