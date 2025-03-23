import { Link, Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils';
import useBodyClasses from '@/hooks/useBodyClasses';
import { AuthBrandedLayoutProvider } from './AuthBrandedLayoutProvider';

const Layout = () => {
  // Applying body classes to manage the background color in dark mode
  useBodyClasses('dark:bg-coal-500');

  return (
    <Fragment>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-1.png')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-2-dark.png')}');
          }
        `}
      </style>

      <div className="grid lg:grid-cols-2 grow">
        <div className="lg:rounded-xl lg:border lg:border-gray-200 lg:m-5 order-1 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg">
          <div className="flex flex-col items-center justify-center p-8 lg:p-12 gap-3 mt-52">
            <Link to="/">
              <img
                src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
                className="h-[100px] max-w-none"
                alt="FESENSI Logo"
              />
            </Link>

            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-blue-700">FESENSI</h3>
              <div className="text-base font-medium text-gray-600">
                <span className="text-white-700 font-semibold">AI DRIVEN TECH SUPPORT</span>
                <br />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center p-8 lg:p-10 order-2">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

// AuthBrandedLayout component that wraps the Layout component with AuthBrandedLayoutProvider
const AuthBrandedLayout = () => (
  <AuthBrandedLayoutProvider>
    <Layout />
  </AuthBrandedLayoutProvider>
);

export { AuthBrandedLayout };
