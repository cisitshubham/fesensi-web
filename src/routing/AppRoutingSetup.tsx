import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import {
  AuthenticationWelcomeMessagePage,
  AuthenticationAccountDeactivatedPage,
  AuthenticationGetStartedPage
} from '@/pages/authentication';


// manual imports
import AgentTickets from '@/pages/agent/sidebar/my-tickets/my-tickets';
import Tickets from '@/pages/agent/flow/tickets';
import IncompleteTicket from '@/pages/agent/flow/Incomplete-ticket';
import AdminUsersPage from '@/pages/admin/sidebar/userlist/userslist';
import UserDetailPage from '@/pages/admin/sidebar/userlist/userdetailpage';
import CreateCategory from '@/pages/admin/sidebar/masters/createCategory';
import RolesAndPermissions from '@/pages/admin/sidebar/rolesAndPermissions';
import PermissionsToggle from '@/pages/admin/sidebar/masters/config';
import ResolveTicket from '@/pages/agent/flow/resolve';
import CreateReasons from '@/pages/admin/sidebar/masters/force-reasons';
import AnalyticsPage from '@/pages/admin/sidebar/analytics';

import UserTickets from '@/pages/user/sidebar/mytickets';
import UserTTicketDetails from '@/pages/user/flow/Ticket';
import UserUpdateTicketForm from '@/pages/user/flow/update-ticket';
import UserCreateTicketForm from '@/pages/user/sidebar/CreateTicket';
import ReassignTicket from '@/pages/agent/sidebar/Request-Reassignment/reassign';
import ForceResolve from '@/pages/agent/flow/force-resolve';
import BulkReassign from '@/pages/agent/sidebar/bulk-reassignment/bulk-reassign';
import RequestedReassignment from '@/pages/agent/sidebar/requested-reassignment/requested-reassignmnet';
import FeedbackPage from '@/pages/user/flow/feedback-main';
import DashboardPage from '@/pages/global-components/DashboardPage';
import KnowledgeBasePageAdmin from '@/pages/admin/sidebar/knowledgebase';
import SupportPageAdmin from '@/pages/admin/sidebar/Support-page-admin';
import KnowledgeBasePageUser from '@/pages/user/sidebar/knowledgeBase';
import AnnouncementsUser from '@/pages/user/sidebar/announcements';
import RateUsUser from '@/pages/user/sidebar/rate_us';
import SupportPageUser from '@/pages/user/sidebar/support';
import EscalatedAgent from '@/pages/agent/sidebar/escalted-tickets/escalated';
import SlastatusAgent from '@/pages/agent/sidebar/sla/slastatus';
import AnnouncementsAgent from '@/pages/agent/sidebar/announcements/announcements';
import KnowledgebaseAgent from '@/pages/agent/sidebar/knowledgebase/knowledgebas';
import SupportPageAgent from '@/pages/agent/sidebar/suppport/support';
import AnnouncementsAdmin from '@/pages/admin/sidebar/announcements';
import CresteReassign from '@/pages/admin/sidebar/masters/reassign';
import FeedbackOptions from '@/pages/admin/sidebar/masters/feedbackOptions';
import RequestedReassignmentAdminPending from '@/pages/admin/sidebar/requested-reassign/requested-reassignmentview';
import ReasseignTicketsDetailAdmin from '@/pages/admin/sidebar/requested-reassign/reasseign-tickets-detail';
import PrioritiesManagement from '@/pages/admin/sidebar/masters/prioritites';
import FilteredTickets from '@/pages/agent/filteredTickets';
import RequestedReassignmentAdminApproved from '@/pages/admin/sidebar/requested-reassign/2 tabs/requested-reassignment-approved';
import AdminSupportList from '@/pages/admin/sidebar/admin-support-list';
import FilteredTicketsUser from '@/pages/user/filteredTickets';
import TrustPgeAgent from '@/pages/agent/sidebar/trustAgent';
import EscalatedTicketDetail from '@/pages/agent/sidebar/escalted-tickets/escalatedTicketDetails';
import GetAllTicketsAdmin from '@/pages/admin/sidebar/getalltickets';
import TrustLevels from '@/pages/admin/sidebar/masters/trust-level';
import FilteredTicketsAdmin from '@/pages/admin/flow/filtered-tickets';
const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
          <Route
            path="/auth/account-deactivated"
            element={<AuthenticationAccountDeactivatedPage />}
          />
          <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />

          {/*------------------------------------------ manual routes ------------------------ */}

          {/* Shubham Routings */}
          {/* users */}
       

          {/* aadesh routing  */}
          {/* agent  */}

          <Route path="/agent/mytickets" element={<AgentTickets />} />
          <Route path="/agent/ticket/:id" element={<Tickets />} />
          <Route path="/agent/ticket/resolve/:id" element={<ResolveTicket />} />
          <Route path="/agent/incomplete-ticket" element={<IncompleteTicket />} />
          <Route path="/agent/reassign-ticket/:id" element={<ReassignTicket />} />
          <Route path="/agent/Force-resolve/:id" element={<ForceResolve />} />
          <Route path="/agent/bulk-reassignment" element={<BulkReassign />} />
          <Route path="/agent/requested-reassignment/" element={<RequestedReassignment />} />
          <Route path="/agent/escalated-tickets" element={<EscalatedAgent />} />
          <Route path="/agent/escalated-tickets/detail/:id" element={<EscalatedTicketDetail />} />
          <Route path="/agent/Sla-Status" element={<SlastatusAgent />} />
          <Route path="/agent/announcements" element={<AnnouncementsAgent />} />
          <Route path="/agent/knowledgeBase" element={<KnowledgebaseAgent />} />
          <Route path="/agent/Support" element={<SupportPageAgent />} />
          <Route path="/agent/tickets/filtered" element={<FilteredTickets />} />
          <Route path="/agent/Trust" element={<TrustPgeAgent/>} />



          {/* admin */}
          <Route path="/admin/AllTickets" element={<GetAllTicketsAdmin />} />
          <Route path="/admin/allUsers" element={<AdminUsersPage />} />
          <Route path="/admin/user/:id?" element={<UserDetailPage />} />
          <Route path="/admin/categories" element={<CreateCategory />} />
          <Route path="/admin/roles" element={<RolesAndPermissions />} />
          <Route path="/admin/configurations" element={<PermissionsToggle />} />
          <Route path="/admin/force-reasons" element={<CreateReasons />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/knowledgeBase" element={<KnowledgeBasePageAdmin />} />
          <Route path="/admin/Support" element={<SupportPageAdmin />} />
          <Route path="/admin/announcements" element={<AnnouncementsAdmin />} />
          <Route path="/admin/reassign" element={<CresteReassign />} />
          <Route path="/admin/feedback-options" element={<FeedbackOptions />} />
          <Route path="/admin/requested-reassignment/pending" element={<RequestedReassignmentAdminPending />} />
          <Route path="/admin/requested-reassignment/approved" element={<RequestedReassignmentAdminApproved />} />
          <Route path="/admin/requested-reassign/:id" element={<ReasseignTicketsDetailAdmin />} />
          <Route path="/admin/priorities" element={<PrioritiesManagement />} />
          <Route path="/admin/support-list" element={<AdminSupportList />} />
          <Route path="/admin/trust-levels" element={<TrustLevels />} />
          <Route path="/admin/tickets/filtered" element={<FilteredTicketsAdmin />} />

          {/* users aadesh  */}
          <Route path="/user/MyTickets" element={<UserTickets />} />
          <Route path="/user/ticket/:id" element={<UserTTicketDetails />} />
          <Route path="/user/ticket/update/:id" element={<UserUpdateTicketForm />} />
          <Route path="/create-ticket" element={<UserCreateTicketForm />} />
          <Route path="user/feedback/:id" element={<FeedbackPage/>} />
          <Route path="user/knowledgeBase" element={<KnowledgeBasePageUser/>} />
          <Route path="user/announcements" element={<AnnouncementsUser/>} />
          <Route path="/user/rate-us" element={<RateUsUser/>} />
          <Route path="/user/Support" element={<SupportPageUser/>} />
          <Route path="/user/tickets/filtered" element={<FilteredTicketsUser />} />


        </Route>
      </Route>




















      
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
