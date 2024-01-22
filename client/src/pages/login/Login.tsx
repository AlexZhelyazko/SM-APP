import "./login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

interface LoginProps {
  sendMessage: any;
}

export const Login: React.FC<LoginProps> = ({ sendMessage }) => {
  const { login, currentUser } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
      // if (currentUser?.id && sendMessage) {
      //   sendMessage(
      //     JSON.stringify({ type: "user-id", userId: currentUser?.id })
      //   );
      // }
    } catch (error: any) {
      setErr(error.response.data);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>Some text</p>
          <span>Don't you have an account?</span>
          <NavLink to="/register">
            <button>Register</button>
          </NavLink>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={(e) => handleLogin(e)}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};
