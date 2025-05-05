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


  // Customer Tabs
  ...(roles.includes('CUSTOMER')
    ? [
      {
        title: 'Dashboard',
        icon: 'element-11',
        path: '/'
      },
      {
        title: "Create Ticket",
        icon: "plus",
        path:"/user/create-ticket"
      },
      {
        title: 'MyTickets',
        icon: 'document',
        path: '/user/MyTickets'
      },

      {
        title: 'knowledge base',
        icon: 'book-open',
        path: '/user/knowledgeBase'

      },

      {
        title: 'Announcements',
        icon: 'notification-status',
        path: '/user/announcements'

      },
      {
        title: 'Rate Us/Feedback',
        icon: 'star',
        path: '/user/rate-us'
      },
      {
        title: 'Trust Level',
        icon: 'like-shapes',
        path: '/user/Trust'
      },

      {
        title: 'Contact Support',
        icon: 'abstract-32',
        path: '/user/Support'
      },
    ]
    : []),

  // Aegent Tabs
  ...(roles.includes('AGENT')
    ? [
      {
        title: 'Dashboard',
        icon: 'element-11',
        path: '/'
      },
      {
        title: 'My Tickets',
        icon: 'file-sheet',
        path: '/agent/mytickets'
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
        title: 'Escalated tickets',
        icon: 'flag',
        path: '/agent/escalated-tickets'
      },
      {
        title: 'SLA Status',
        icon: 'timer',
        path: '/agent/sla-status'
      },


      {
        title: 'Announcements',
        icon: 'notification-status',
        path: '/agent/announcements'

      },
      {
        title: 'knowledge base',
        icon: 'book-open',
        path: '/agent/knowledgeBase'

      },
      {
        title: 'Contact Support',
        icon: 'abstract-32',
        path: '/agent/Support'
      }

    ]
    : []),

  // admin Tabs
  ...(roles.includes('ADMIN')
    ? [
      {
        title: 'Dashboard',
        icon: 'element-11',
        path: '/'
      },
      {
        title: 'Analytics',
        icon: 'compass',
        path: '/admin/analytics'
      },
      {
        title: 'Users',
        icon: 'users',
        path: '/admin/allUsers'
      },
      {
        title: 'Roles & Permissions',
        icon: 'shield',
        path: '/admin/roles'
      },
      {
        title: 'Masters',
        icon: 'shield',
        children: [
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
            path: '/admin/configurations',
          }
        ]
      },
      {
        title: 'knowledge base',
        icon: 'book-open',
        path: '/admin/knowledgeBase',
      },
      {
        title: 'Contact Support',
        icon: 'abstract-32',
        path: '/admin/Support'
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
  // {
  //   title: 'Public Profile',
  //   icon: 'profile-circle',
  //   rootPath: '/public-profile/',
  //   path: 'public-profile/profiles/default',
  //   childrenIndex: 2
  // },
  // {
  //   title: 'Account',
  //   icon: 'setting-2',
  //   rootPath: '/account/',
  //   path: '/',
  //   childrenIndex: 3
  // },
  // {
  //   title: 'Network',
  //   icon: 'users',
  //   rootPath: '/network/',
  //   path: 'network/get-started',
  //   childrenIndex: 4
  // },
  // {
  //   title: 'Authentication',
  //   icon: 'security-user',
  //   rootPath: '/authentication/',
  //   path: 'authentication/get-started',
  //   childrenIndex: 5
  // }
];
