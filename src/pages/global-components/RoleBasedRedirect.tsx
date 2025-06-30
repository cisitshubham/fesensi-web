import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let selectedRole = localStorage.getItem('selectedRole');
    // Try to parse if it's a JSON array
    try {
      const parsed = JSON.parse(selectedRole as string);
      if (Array.isArray(parsed)) selectedRole = parsed[0];
    } catch {}
    // Normalize to string
    if (typeof selectedRole === 'string') {
      selectedRole = selectedRole.replace(/"/g, ''); // Remove quotes if any
    }
    // Debug log
    console.log('Redirecting for role:', selectedRole);
    if (selectedRole === 'ADMIN') navigate('/admin/dashboard', { replace: true });
    else if (selectedRole === 'AGENT') navigate('/agent/dashboard', { replace: true });
    else if (selectedRole === 'USER' || selectedRole === 'CUSTOMER') navigate('/user/dashboard', { replace: true });
    else navigate('/auth/login', { replace: true });
  }, [navigate]);
  return null;
};

export default RoleBasedRedirect; 