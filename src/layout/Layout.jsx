import { Outlet } from "react-router-dom";
import LeftBar from "../components/LeftBar/LeftBar";
import Navbar from "../components/Navbar/NavBar";
import RightBar from "../components/RightBar/RightBar";
import { DarkModeContext } from "../context/darkModeContext";
import { useContext } from "react";

export const Layout = ({ sendMessage, socket }) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`theme-${darkMode ? "dark" : "light"}`}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Navbar sendMessage={sendMessage} socket={socket} />
      <div style={{ display: "flex" }}>
        <LeftBar />
        <div style={{ flex: "6" }}>
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  );
};
