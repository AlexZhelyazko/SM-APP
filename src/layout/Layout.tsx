import { Outlet } from 'react-router-dom';
import LeftBar from '../components/LeftBar/LeftBar';
import Navbar from '../components/Navbar/Navbar';
import RightBar from '../components/RightBar/RightBar';

export const Layout = () => {
  return (
    <div className="theme-dark" style={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <LeftBar />
        <div style={{ flex: '6' }}>
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  );
};
