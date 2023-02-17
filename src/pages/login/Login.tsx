import './login.scss';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export const Login = () => {
  const { login } = useContext(AuthContext);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login();
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
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="password" />
            <button onClick={(e) => handleLogin(e)}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};
