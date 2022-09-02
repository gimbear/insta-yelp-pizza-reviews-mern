import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export function ProtectedOutlet() {
  const auth = useAuth();
  const location = useLocation();

  return auth.user ? (
    <>
      {console.log('AUTHORIZED')}
      <Outlet />
    </>
  ) : (
    <>
      <Navigate to="/login" state={{ from: location }} />
    </>
  );
}
