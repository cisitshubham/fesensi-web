import { Link, Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils';
import useBodyClasses from '@/hooks/useBodyClasses';
import { AuthBrandedLayoutProvider } from './AuthBrandedLayoutProvider';
import { Footer } from '@/layouts/demo1/footer/Footer';

const Layout = () => {
  // Applying body classes to manage the background color in dark mode
  useBodyClasses('dark:bg-coal-500');

  return (
    <Fragment>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg.png')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg.png')}');
          }
        `}
      </style>

      <div className="grid lg:grid-cols-5 grow">
        <div className="flex justify-center items-center p-8 lg:p-10 lg:col-span-2 order-1">
          <Outlet />
        </div>

        <div className=" lg:border lg:border-gray-200 lg:col-span-3 order-2 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg relative min-h-screen">
          <div className="flex flex-col  justify-center lg:p-12 gap-3 mt-52">
            {/* <Link to="/">
              <img
                src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
                className="h-[100px] max-w-none"
                alt="FESENSI Logo"
              />
            </Link> */}
            <div className="flex flex-col pl-8 text-white">
              <h1 className="text-7xl ">Welcome To </h1>
              <span className=" text-7xl font-bold " >FESENSI</span>
              <span className="font-semibold mt-5 tracking-[4px]">AI DRIVEN TECH SUPPORT</span>
            </div>
          </div>
          <div className="absolute  bottom-0 w-full flex justify-between items-center p-8 text-sm text-white">
            <Footer></Footer>
          </div>
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
