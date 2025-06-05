import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';
import { useEffect } from 'react';

const RequireAuth = () => {
  const { auth, loading, verify } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    if (auth) {
      verify();
    }
  }, [auth, verify]);

  if (loading) {
    return <ScreenLoader />;
  }

  return auth ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export { RequireAuth };
