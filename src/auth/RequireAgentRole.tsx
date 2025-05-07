import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';

const RequireAgentRole = () => {
  const { auth, loading, currentUser } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }

  const isAgent = currentUser?.role === 'AGENT';

  return auth && isAgent ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export { RequireAgentRole }; 