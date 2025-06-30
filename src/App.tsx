import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSettings } from '@/providers/SettingsProvider';
import { AppRouting } from '@/routing';
import { PathnameProvider } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import Plan_Error from '@/pages/global-components/plan_error';

const { BASE_URL } = import.meta.env;

const App = () => {
  const { settings } = useSettings();
  const [showPlanError, setShowPlanError] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add(settings.themeMode);
  }, [settings]);

  useEffect(() => {
    const handler = () => setShowPlanError(true);
    window.addEventListener('plan-upgrade-required', handler);
    return () => window.removeEventListener('plan-upgrade-required', handler);
  }, []);

  return (
    <BrowserRouter
      basename={BASE_URL}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <PathnameProvider>
        <AppRouting />
      </PathnameProvider>
      <Toaster />
      {showPlanError && <Plan_Error />}
    </BrowserRouter>
  );
};

export { App };
