import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AuthContext } from './context/authContext';
import { Layout } from './layout/Layout';
import { Home } from './pages/home/Home';
import { Login } from './pages/login/Login';
import { Profile } from './pages/profile/Profile';
import { Register } from './pages/register/Register';
import './style.scss';

export const App: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
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
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};
