import { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAuthContext } from '@/auth';
import { useLoaders } from '@/providers';
import { AppRoutingSetup } from '.';

const AppRouting = (): ReactElement => {
  const { setProgressBarLoader } = useLoaders();
  const { verify, setLoading, auth } = useAuthContext();
  const [previousLocation, setPreviousLocation] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const location = useLocation();
  const path = location.pathname.trim();

  // Handle initial load
  useEffect(() => {
    if (firstLoad) {
      console.log('Initial load: Verifying user...');
      verify()
        .then(() => {
          console.log('User verified successfully on initial load.');
        })
        .catch((error) => {
          console.error('Error during initial user verification:', error);
        })
        .finally(() => {
          setLoading(false);
          setFirstLoad(false);
        });
    }
  }, []); // Add empty dependency array for initial load only

  // Handle route changes and auth state changes
  useEffect(() => {
    if (!firstLoad && auth) {
      setProgressBarLoader(true);
      verify()
        .then(() => {
        })
        .catch((error) => {
          console.error('Error during user verification on route/auth change:', error);
          throw new Error('User verify request failed!');
        })
        .finally(() => {
          setPreviousLocation(path);
          setProgressBarLoader(false);
          if (path === previousLocation) {
            setPreviousLocation('');
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, auth, firstLoad]);

  useEffect(() => {
    if (!CSS.escape(window.location.hash)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [previousLocation]);

  return <AppRoutingSetup />;
};

export { AppRouting };
