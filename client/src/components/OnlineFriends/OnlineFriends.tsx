import React from "react";
import "./online.scss";

const OnlineFriends = () => {
  return (
    <div className="item">
      <span>Online Friends</span>
      <div className="user">
        <div className="userInfo">
          <img
            src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
          />
          <div className="online" />
          <span>Jane Doe</span>
        </div>
      </div>
    </div>
  );
};

export default OnlineFriends;
