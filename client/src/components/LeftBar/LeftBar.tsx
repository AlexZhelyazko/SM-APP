import "./leftbar.scss";
import { useContext } from "react";
import Friends from "../../assets/1.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Messages from "../../assets/10.png";
import { AuthContext } from "../../context/authContext";
import { NavLink } from "react-router-dom";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            {/* <OnlineStatusIndicator /> */}
            <NavLink to={`/profile/${currentUser.id}`}>
              <span>
                <img
                  src={
                    currentUser.profilePic
                      ? "/upload/" + currentUser.profilePic
                      : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                  }
                  alt="profilePic"
                />
              </span>
              <span>{currentUser.name}</span>
            </NavLink>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <NavLink to="/followings">Followings</NavLink>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <span>Followers (in dev)</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <NavLink to="/">News</NavLink>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Games (In Dev)</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <NavLink to="/dialogs">Dialogs </NavLink>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;
