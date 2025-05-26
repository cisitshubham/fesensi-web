/* eslint-disable prettier/prettier */
import { type TMenuConfig } from '@/components/menu';
import { verifyRole } from '@/api/api';
import path from 'path';

let role: string[] = [];
(async () => {
  const res = await verifyRole();
  role = res?.data?.role ?? [];
})();

// const res = await verifyRole();
// const role = res?.data?.role ?? [];

export const getSidebarMenu = (type: string, role: string): TMenuConfig => [
  // Customer Tabs
  ...(role === 'CUSTOMER'
    ? [
      {
        title: 'Dashboard',
        icon: 'element-11',
        path: '/'
      },
      {
        title: 'Create Ticket',
        icon: 'plus',
        path: '/user/create-ticket'
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
      }
    ]
    : []),

  // Agent Tabs
  ...(role === 'AGENT'
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
        title: 'Escalated Tickets',
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
        title: 'knowledge Base',
        icon: 'book-open',
        path: '/agent/knowledgeBase'
      },
      {
        title: 'Contact Support',
        icon: 'abstract-32',
        path: '/agent/Support'
      },
      {
        title: 'Trust Level',
        icon: 'like-shapes',
        path: '/agent/Trust'
      }
    ]
    : []),

  // Admin Tabs
  ...(role === 'ADMIN'
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
        title: 'All Tickets',
        icon: 'file-sheet',
        path: '/admin/AllTickets'
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
        title: 'Announcements',
        icon: 'notification-status',
        path: '/admin/announcements'
      },
      {
        title: 'Requested for Reassignment',
        icon: 'update-file',
        children: [
          {
            title: 'Pending',
            path: '/admin/requested-reassignment/pending'
          },
          {
            title: 'Approved',
            path: '/admin/requested-reassignment/approved'
          }
        ]
      },
      {
        title: 'Masters',
        icon: 'diamonds',
        children: [
          {
            title: 'Configuration',
            icon: 'setting',
            path: '/admin/configurations'
          },
          {
            title: 'Priorities',
            icon: 'folder',
            path: '/admin/priorities'
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
            title: 'Reassign Options',
            path: '/admin/reassign'
          },
          {
            title: 'FeedBack Options',
            path: '/admin/feedback-options'
          }
        ]
      },
      {
        title: 'knowledge Base',
        icon: 'book-open',
        path: '/admin/knowledgeBase'
      },
      {
        title: 'Support List ',
        icon: 'file-sheet',
        path: '/admin/support-list'
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
  }
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
