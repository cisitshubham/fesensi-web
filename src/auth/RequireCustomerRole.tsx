import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';

const RequireCustomerRole = () => {
  const { auth, loading, currentUser } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }

  const isCustomer = currentUser?.role === 'CUSTOMER';

  return auth && isCustomer ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export { RequireCustomerRole }; 