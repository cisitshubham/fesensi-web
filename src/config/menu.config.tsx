/* eslint-disable prettier/prettier */
import { type TMenuConfig } from '@/components/menu';
import { verifyRole } from '@/api/api';
import { title } from 'process';
import path from 'path';

let role: string[] = [];
(async () => {
  const res = await verifyRole();
  role = res?.data?.role ?? [];
})();

// const res = await verifyRole();
// const role = res?.data?.role ?? [];

export const getSidebarMenu = (type: string, roles: string[]): TMenuConfig => [
  {
    title: 'Dashboard',
    icon: 'element-11',
    path: '/'
  },

  // Customer Tabs
  ...(roles.includes('CUSTOMER')
    ? [
      {
        title: 'Tickets',
        icon: 'document',
        path: '/user/MyTickets'
      },
      {
        title: 'knowledge base',
        icon: 'book-open'

      },
      {
        title: 'Draft Tickets',
        icon: 'pencil'
      },
      {
        title: 'Escalated tickets',
        icon: 'flag'
      },
      {
        title: 'SLA Status',
        icon: 'timer'
      },
      {
        title: 'Archived Tickets',
        icon: 'file-down'
      },
      {
        title: 'Contact Support',
        icon: 'abstract-32'
      },
      {
        title: 'Announcements',
        icon: 'notification-status'

      },
      {
        title: 'Rate Us/Feedback',
        icon: 'star'
      },
      {
        title: 'Trust Level',
        icon: 'like-shapes'
      }
    ]
    : []),

  // Aegent Tabs
  ...(roles.includes('AGENT')
    ? [
      {
        title: 'My Tickets',
        icon: 'file-sheet',
        path: '/agent/mytickets'
      },
      {
        title: 'knowledge base',
        icon: 'book-open'

      },
      {
        title: 'Bulk Reassignment',
        icon: 'file-sheet',
        path: '/agent/bulk-reassignment'
      },
      {
        title: 'Requested Reassignment',
        icon: 'file-sheet',
        path: '/agent/requested-reassignment'
      },
      {
        title: 'Draft Tickets',
        icon: 'pencil'
      },
      {
        title: 'Escalated tickets',
        icon: 'flag'
      },
      {
        title: 'SLA Status',
        icon: 'timer'
      },
      {
        title: 'Archived Tickets',
        icon: 'file-down'
      },
      {
        title: 'Contact Support',
        icon: 'abstract-32'
      },
      {
        title: 'Announcements',
        icon: 'notification-status'

      },
      {
        title: 'Rate Us/Feedback',
        icon: 'star'
      },
      {
        title: 'Trust Level',
        icon: 'like-shapes'
      }
    ]
    : []),

  // admin Tabs
  ...(roles.includes('ADMIN')
    ? [
      {
        title: 'All Users',
        icon: 'users',
        path: '/admin/allUsers'
      },
      {
        title: 'Permissions and Roles',
        icon: 'shield',
        path: '/admin/roles'
      },
      {
        title: 'Categories',
        icon: 'folder',
        path: '/admin/categories'
      },
      {
        title: 'Force Reasons',
        icon: 'lock-3',
        path: '/admin/force-reasons'
      },
      {
        title: 'Configuration',
        icon: 'setting',
        path: '/admin/configurations'
      },
      {
        title: 'Analytics',
        icon: 'compass',
        path: '/admin/analytics'
      }
    ]
    : [])
];

export const getMegaMenu = (roles: string[]): TMenuConfig => [
  {
    title: 'Home',
    path: '/'
  },
  // ...(roles.includes('ADMIN')
  //   ? [
  //       {
  //         title: 'Admin Dashboard',
  //         path: '/admin'
  //       }
  //     ]
  //   : []),
  // ...(roles.includes('AGENT')
  //   ? [
  //       {
  //         title: 'Agent Workspace',
  //         path: '/agent/workspace'
  //       }
  //     ]
  //   : []),
  // ...(roles.includes('CUSTOMER')
  //   ? [
  //       {
  //         title: 'Support Center',
  //         path: '/support'
  //       }
  //     ]
  //   : [])
];

export const MENU_ROOT: TMenuConfig = [
  {
    title: 'Public Profile',
    icon: 'profile-circle',
    rootPath: '/public-profile/',
    path: 'public-profile/profiles/default',
    childrenIndex: 2
  },
  {
    title: 'Account',
    icon: 'setting-2',
    rootPath: '/account/',
    path: '/',
    childrenIndex: 3
  },
  {
    title: 'Network',
    icon: 'users',
    rootPath: '/network/',
    path: 'network/get-started',
    childrenIndex: 4
  },
  {
    title: 'Authentication',
    icon: 'security-user',
    rootPath: '/authentication/',
    path: 'authentication/get-started',
    childrenIndex: 5
  }
];
