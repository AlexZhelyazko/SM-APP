import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  currentUser: any;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="login" />;
  }
  return children;
};
