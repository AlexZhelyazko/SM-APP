import './login.scss';
import { NavLink } from 'react-router-dom';

export const Login = () => {
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
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};
