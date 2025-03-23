import React, { forwardRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDemo1Layout } from '../';
import { toAbsoluteUrl } from '@/utils';
import { SidebarToggle } from './';

const SidebarHeader = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { layout } = useDemo1Layout();

  const lightLogo = () => (
    <Fragment>
      <Link to="/" className="dark:hidden">
        <div className="flex items-center gap-1 default-logo">
          <img
            src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
            className=" h-[22px] max-w-none"
          />
          <h1 className="bg-gradient-to-r from-[#314DCA] to-[#5A77FA] tracking-wider font-bold uppercase text-nowrap bg-clip-text text-transparent">
            Fesensi
          </h1>
        </div>
        <img
          src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
          className="small-logo h-[22px] max-w-none"
        />
      </Link>
      <Link to="/" className="hidden dark:block">
        <div className="flex items-center gap-1 default-logo">
          <img
            src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
            className=" h-[22px] max-w-none"
          />
          <h1 className="text-white font-bold uppercase tracking-wider text-nowrap">Fesensi</h1>
        </div>
        <img
          src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
          className="small-logo h-[22px] max-w-none"
        />
      </Link>
    </Fragment>
  );

  const darkLogo = () => (
    <Link to="/">
      <img
        src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
        className="default-logo h-[22px] max-w-none"
      />
      <img
        src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
        className="small-logo h-[22px] max-w-none"
      />
    </Link>
  );

  return (
    <div
      ref={ref}
      className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0"
    >
      {layout.options.sidebar.theme === 'light' ? lightLogo() : darkLogo()}
      <SidebarToggle />
    </div>
  );
});

export { SidebarHeader };
