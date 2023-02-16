import { Outlet } from 'react-router-dom';
import { LeftBar } from '../components/LeftBar/LeftBar';
import Navbar from '../components/Navbar/Navbar';
import { RightBar } from '../components/RightBar/RightBar';

export const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div>
        <LeftBar />
        <Outlet />
        <RightBar />
      </div>
    </div>
  );
};
