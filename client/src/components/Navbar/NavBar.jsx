import "./navbar.scss";
import axios from "axios";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Navbar = ({ sendMessage, socket }) => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  let userId = currentUser.id;

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      sendMessage(JSON.stringify({ type: "user-logout", userId }));
      await logout();
      socket.close();
      navigate("/login");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>SN</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
        <div className="user">
          <img
            src={
              currentUser.profilePic
                ? "/upload/" + currentUser.profilePic
                : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
            }
            alt="profilePic"
          />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
