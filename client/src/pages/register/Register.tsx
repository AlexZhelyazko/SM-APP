import "./register.scss";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setErr(null);
      const res = await axios.post(
        "http://localhost:8800/api/auth/register",
        inputs
      );
      console.log(res);
    } catch (error: any) {
      console.log(error);
      setErr(error.response.data);
    }
  };

  console.log(inputs);
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>Some text</p>
          <span>Do you have an account?</span>
          <NavLink to="/login">
            <button>Login</button>
          </NavLink>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={(e) => handleChange(e)}
            />
            {err && <div>{err}</div>}
            <button onClick={(e) => handleClick(e)}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};
