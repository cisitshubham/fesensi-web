import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';

const RequireAdminRole = () => {
  const { auth, loading, currentUser } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }

  const isAdmin = currentUser?.role === 'ADMIN';

  return auth && isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export { RequireAdminRole }; 