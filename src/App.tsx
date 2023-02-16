import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Layout } from './layout/Layout';
import { Home } from './pages/home/Home';
import { Login } from './pages/login/Login';
import { Profile } from './pages/profile/Profile';
import { Register } from './pages/register/Register';

export const App: React.FC = () => {
  const currentUser = true;
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <Register />
          </ProtectedRoute>
        }
      />
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
