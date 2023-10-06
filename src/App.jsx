import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { Friends } from "./pages/Friends/Friends";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { AuthContext } from "./context/authContext";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import { Register } from "./pages/register/Register";
import "./style.scss";
import useOnlineUsersStatus from "./hooks/useOnlineStatus";
import Messages from "./pages/Dialogs/Dialogs";
import Chat from "./components/Chat/Chat";

export const App = () => {
  const { currentUser } = useContext(AuthContext);
  const { onlineUsers, sendMessage, socket } = useOnlineUsersStatus(
    currentUser?.id
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} sendMessage={sendMessage} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout sendMessage={sendMessage} socket={socket} />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Profile onlineUsers={onlineUsers} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dialogs"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dialogs/:dialogId"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/followings"
          element={<Friends onlineUsers={onlineUsers} />}
        />
      </Route>
    </Routes>
  );
};
