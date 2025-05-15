import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';

import {
  ProfileActivityPage,
  ProfileBloggerPage,
  CampaignsCardPage,
  CampaignsListPage,
  ProjectColumn2Page,
  ProjectColumn3Page,
  ProfileCompanyPage,
  ProfileCreatorPage,
  ProfileCRMPage,
  ProfileDefaultPage,
  ProfileEmptyPage,
  ProfileFeedsPage,
  ProfileGamerPage,
  ProfileModalPage,
  ProfileNetworkPage,
  ProfileNFTPage,
  ProfilePlainPage,
  ProfileTeamsPage,
  ProfileWorksPage,
  CreateTicketForm,
  UpdateTicketForm,
  ViewTicket
} from '@/pages/public-profile';
import {
  AccountActivityPage,
  AccountAllowedIPAddressesPage,
  AccountApiKeysPage,
  AccountAppearancePage,
  AccountBackupAndRecoveryPage,
  AccountBasicPage,
  AccountCompanyProfilePage,
  AccountCurrentSessionsPage,
  AccountDeviceManagementPage,
  AccountEnterprisePage,
  AccountGetStartedPage,
  AccountHistoryPage,
  AccountImportMembersPage,
  AccountIntegrationsPage,
  AccountInviteAFriendPage,
  AccountMembersStarterPage,
  AccountNotificationsPage,
  AccountOverviewPage,
  AccountPermissionsCheckPage,
  AccountPermissionsTogglePage,
  AccountPlansPage,
  AccountPrivacySettingsPage,
  AccountRolesPage,
  AccountSecurityGetStartedPage,
  AccountSecurityLogPage,
  AccountSettingsEnterprisePage,
  AccountSettingsModalPage,
  AccountSettingsPlainPage,
  AccountSettingsSidebarPage,
  AccountTeamInfoPage,
  AccountTeamMembersPage,
  AccountTeamsPage,
  AccountTeamsStarterPage,
  AccountUserProfilePage
} from '@/pages/account';
import {
  NetworkAppRosterPage,
  NetworkMarketAuthorsPage,
  NetworkAuthorPage,
  NetworkGetStartedPage,
  NetworkMiniCardsPage,
  NetworkNFTPage,
  NetworkSocialPage,
  NetworkUserCardsTeamCrewPage,
  NetworkSaasUsersPage,
  NetworkStoreClientsPage,
  NetworkUserTableTeamCrewPage,
  NetworkVisitorsPage
} from '@/pages/network';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import {
  AuthenticationWelcomeMessagePage,
  AuthenticationAccountDeactivatedPage,
  AuthenticationGetStartedPage
} from '@/pages/authentication';

import { Filter } from '@/pages/TicketFiter';

// manual imports
import AgentTickets from '@/pages/agent/sidebar/my-tickets/my-tickets';
import Tickets from '@/pages/agent/flow/tickets';
import IncompleteTicket from '@/pages/agent/flow/Incomplete-ticket';
import AdminUsersPage from '@/pages/admin/sidebar/userlist/userslist';
import UserDetailPage from '@/pages/admin/sidebar/userlist/userdetailpage';
import CreateCategory from '@/pages/admin/sidebar/masters/createCategory';
import RolesAndPermissions from '@/pages/admin/sidebar/rolesAndPermissions';
import PermissionsToggle from '@/pages/admin/sidebar/config';
import ResolveTicket from '@/pages/agent/flow/resolve';
import CreateReasons from '@/pages/admin/sidebar/masters/force-reasons';
import AnalyticsPage from '@/pages/admin/sidebar/analytics';

import UserTickets from '@/pages/user/sidebar/mytickets';
import UserTTicketDetails from '@/pages/user/flow/Ticket';
import UserResolveTicket from '@/pages/user/flow/Resolve';
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
import TrustPgeUser from '@/pages/user/sidebar/trust';
import SupportPageUser from '@/pages/user/sidebar/support';
import EscalatedAgent from '@/pages/agent/sidebar/escalted-tickets/escalated';
import SlastatusAgent from '@/pages/agent/sidebar/sla/slastatus';
import AnnouncementsAgent from '@/pages/agent/sidebar/announcements/announcements';
import KnowledgebaseAgent from '@/pages/agent/sidebar/knowledgebase/knowledgebas';
import SupportPageAgent from '@/pages/agent/sidebar/suppport/support';
import AnnouncementsAdmin from '@/pages/admin/sidebar/announcements';
import CresteReassign from '@/pages/admin/sidebar/masters/reassign';
import FeedbackOptions from '@/pages/admin/sidebar/masters/feedbackOptions';
import RequestedReassignmentAdmin from '@/pages/admin/sidebar/requested-reassign/requested-reassignmentview';
import ReasseignTicketsDetailAdmin from '@/pages/admin/sidebar/requested-reassign/reasseign-tickets-detail';
import PrioritiesManagement from '@/pages/admin/sidebar/masters/prioritites';
import FilteredTickets from '@/pages/agent/filteredTickets';
const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          <Route path="/public-profile/profiles/default" element={<ProfileDefaultPage />} />
          <Route path="/public-profile/profiles/creator" element={<ProfileCreatorPage />} />
          <Route path="/public-profile/profiles/company" element={<ProfileCompanyPage />} />
          <Route path="/public-profile/profiles/nft" element={<ProfileNFTPage />} />
          <Route path="/public-profile/profiles/blogger" element={<ProfileBloggerPage />} />
          <Route path="/public-profile/profiles/crm" element={<ProfileCRMPage />} />
          <Route path="/public-profile/profiles/gamer" element={<ProfileGamerPage />} />
          <Route path="/public-profile/profiles/feeds" element={<ProfileFeedsPage />} />
          <Route path="/public-profile/profiles/plain" element={<ProfilePlainPage />} />
          <Route path="/public-profile/profiles/modal" element={<ProfileModalPage />} />
          <Route path="/public-profile/projects/3-columns" element={<ProjectColumn3Page />} />
          <Route path="/public-profile/projects/2-columns" element={<ProjectColumn2Page />} />
          <Route path="/public-profile/works" element={<ProfileWorksPage />} />
          <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
          <Route path="/public-profile/network" element={<ProfileNetworkPage />} />
          <Route path="/public-profile/activity" element={<ProfileActivityPage />} />
          <Route path="/public-profile/campaigns/card" element={<CampaignsCardPage />} />
          <Route path="/public-profile/campaigns/list" element={<CampaignsListPage />} />
          <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
          <Route path="/account/home/get-started" element={<AccountGetStartedPage />} />
          <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
          <Route path="/account/home/company-profile" element={<AccountCompanyProfilePage />} />
          <Route path="/account/home/settings-sidebar" element={<AccountSettingsSidebarPage />} />
          <Route
            path="/account/home/settings-enterprise"
            element={<AccountSettingsEnterprisePage />}
          />
          <Route path="/account/home/settings-plain" element={<AccountSettingsPlainPage />} />
          <Route path="/account/home/settings-modal" element={<AccountSettingsModalPage />} />
          <Route path="/account/billing/basic" element={<AccountBasicPage />} />
          <Route path="/account/billing/enterprise" element={<AccountEnterprisePage />} />
          <Route path="/account/billing/plans" element={<AccountPlansPage />} />
          <Route path="/account/billing/history" element={<AccountHistoryPage />} />
          <Route path="/account/security/get-started" element={<AccountSecurityGetStartedPage />} />
          <Route path="/account/security/overview" element={<AccountOverviewPage />} />
          <Route
            path="/account/security/allowed-ip-addresses"
            element={<AccountAllowedIPAddressesPage />}
          />
          <Route
            path="/account/security/privacy-settings"
            element={<AccountPrivacySettingsPage />}
          />
          <Route
            path="/account/security/device-management"
            element={<AccountDeviceManagementPage />}
          />
          <Route
            path="/account/security/backup-and-recovery"
            element={<AccountBackupAndRecoveryPage />}
          />
          <Route
            path="/account/security/current-sessions"
            element={<AccountCurrentSessionsPage />}
          />
          <Route path="/account/security/security-log" element={<AccountSecurityLogPage />} />
          <Route path="/account/members/team-starter" element={<AccountTeamsStarterPage />} />
          <Route path="/account/members/teams" element={<AccountTeamsPage />} />
          <Route path="/account/members/team-info" element={<AccountTeamInfoPage />} />
          <Route path="/account/members/members-starter" element={<AccountMembersStarterPage />} />
          <Route path="/account/members/team-members" element={<AccountTeamMembersPage />} />
          <Route path="/account/members/import-members" element={<AccountImportMembersPage />} />
          <Route path="/account/members/roles" element={<AccountRolesPage />} />
          <Route
            path="/account/members/permissions-toggle"
            element={<AccountPermissionsTogglePage />}
          />
          <Route
            path="/account/members/permissions-check"
            element={<AccountPermissionsCheckPage />}
          />
          <Route path="/account/integrations" element={<AccountIntegrationsPage />} />
          <Route path="/account/notifications" element={<AccountNotificationsPage />} />
          <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
          <Route path="/account/appearance" element={<AccountAppearancePage />} />
          <Route path="/account/invite-a-friend" element={<AccountInviteAFriendPage />} />
          <Route path="/account/activity" element={<AccountActivityPage />} />
          <Route path="/network/get-started" element={<NetworkGetStartedPage />} />
          <Route path="/network/user-cards/mini-cards" element={<NetworkMiniCardsPage />} />
          <Route path="/network/user-cards/team-crew" element={<NetworkUserCardsTeamCrewPage />} />
          <Route path="/network/user-cards/author" element={<NetworkAuthorPage />} />
          <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
          <Route path="/network/user-cards/social" element={<NetworkSocialPage />} />
          <Route path="/network/user-table/team-crew" element={<NetworkUserTableTeamCrewPage />} />
          <Route path="/network/user-table/app-roster" element={<NetworkAppRosterPage />} />
          <Route path="/network/user-table/market-authors" element={<NetworkMarketAuthorsPage />} />
          <Route path="/network/user-table/saas-users" element={<NetworkSaasUsersPage />} />
          <Route path="/network/user-table/store-clients" element={<NetworkStoreClientsPage />} />
          <Route path="/network/user-table/visitors" element={<NetworkVisitorsPage />} />
          <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
          <Route
            path="/auth/account-deactivated"
            element={<AuthenticationAccountDeactivatedPage />}
          />
          <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />

          {/*------------------------------------------ manual routes ------------------------ */}

          {/* Shubham Routings */}
          {/* users */}
          <Route path="/public-profile/projects/createTickets" element={<CreateTicketForm />} />
          <Route
            path="/public-profile/projects/UpdateTicketForm/:id"
            element={<UpdateTicketForm />}
          />
          <Route path="/public-profile/projects/ticket/view/:id" element={<ViewTicket />} />
          <Route path="/TicketFilter/:id?" element={<Filter />} />

          {/* aadesh routing  */}
          {/* agent  */}

          <Route path="/agent/mytickets" element={<AgentTickets />} />
          <Route path="/agent/ticket/:id" element={<Tickets />} />
          <Route path="/agent/ticket/resolve/:id" element={<ResolveTicket />} />
          <Route path="/agent/incomplete-ticket" element={<IncompleteTicket />} />
          <Route path="/agent/reassign-ticket/:id" element={<ReassignTicket />} />
          <Route path="/agent/Force-resolve/:id" element={<ForceResolve />} />
          <Route path="/agent/bulk-reassignment" element={<BulkReassign />} />
          <Route path="/agent/requested-reassignment" element={<RequestedReassignment />} />
          <Route path="/agent/escalated-tickets" element={<EscalatedAgent />} />
          <Route path="/agent/Sla-Status" element={<SlastatusAgent />} />
          <Route path="/agent/announcements" element={<AnnouncementsAgent />} />
          <Route path="/agent/knowledgeBase" element={<KnowledgebaseAgent />} />
          <Route path="/agent/Support" element={<SupportPageAgent />} />
          <Route path="/agent/tickets/filtered" element={<FilteredTickets />} />



          {/* admin */}
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
          <Route path="/admin/requested-reassignment" element={<RequestedReassignmentAdmin />} />
          <Route path="/admin/requested-reassign/:id" element={<ReasseignTicketsDetailAdmin />} />
          <Route path="/admin/priorities" element={<PrioritiesManagement />} />

          {/* users aadesh  */}
          <Route path="/user/MyTickets" element={<UserTickets />} />
          <Route path="/user/ticket/:id" element={<UserTTicketDetails />} />
          <Route path="/user/ticket/update/:id" element={<UserUpdateTicketForm />} />
          <Route path="/user/ticket/resolution/:id" element={<UserResolveTicket />} />
          <Route path="user/create-ticket" element={<UserCreateTicketForm />} />
          <Route path="user/feedback/:id" element={<FeedbackPage/>} />
          <Route path="user/knowledgeBase" element={<KnowledgeBasePageUser/>} />
          <Route path="user/announcements" element={<AnnouncementsUser/>} />
          <Route path="/user/rate-us" element={<RateUsUser/>} />
          <Route path="/user/Trust" element={<TrustPgeUser/>} />
          <Route path="/user/Support" element={<SupportPageUser/>} />


        </Route>
      </Route>




















      
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
