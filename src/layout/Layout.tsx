import { Outlet } from 'react-router-dom';
import { LeftBar } from '../components/LeftBar/LeftBar';
import { NavBar } from '../components/Navbar/NavBar';
import { RightBar } from '../components/RightBar/RightBar';

export const Layout = () => {
  return (
    <div>
      <NavBar />
      <div>
        <LeftBar />
        <Outlet />
        <RightBar />
      </div>
    </div>
  );
};
