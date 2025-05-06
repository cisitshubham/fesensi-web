import { Fragment, useState } from 'react';

import { toAbsoluteUrl } from '@/utils';

import {
  ActivitiesAnniversary,
  ActivitiesBloggingConference,
  ActivitiesDesignerWelcome,
  ActivitiesFollowersMilestone,
  ActivitiesInterview,
  ActivitiesNewArticle,
  ActivitiesNewTeam,
  ActivitiesPhotographyWorkshop,
  ActivitiesProductWebinar,
  ActivitiesProjectStatus,
  ActivitiesUpcomingContent,
  ActivitiesVirtualTeam
} from '@/partials/activities/items';
import { Card } from '@/components/ui/card';

const AnalyticsRoot = () => {
  const [currentReport, setCurrentReport] = useState('Tickets by Status');
  const reports = [
    'Tickets by Status',
    'Tickets by Priority',
    'SLA Compliance Report',
    'Ticket Volume Over Time',
    'Resolution Time Analysis',
    'Response Time Analysis',
    'Escalated Tickets Trend',
    'Agent Performance Report',
    'Tickets by Category',
    'Tickets per Department / User Group',
    'Top Repeated Issues'
  ];

  return (
    <div className="p-6">
    <Card className="flex  gap-5 lg:gap-7.5">
      {reports.map((report, index) => (
        <div
          key={index}
          className={`card grow ${report === currentReport ? '' : 'hidden'}`}
          id={`activity_${report.replace(/\s+/g, '_')}`}
        >
          <div className="card-header">
            <h3 className="card-title">{report}</h3>

          </div>
          <div className="card-body">
            {report === 'Tickets by Status' && <ActivitiesNewArticle />}
            {report === 'Tickets by Priority' && <ActivitiesInterview />}
            {report === 'SLA Compliance Report' && <ActivitiesPhotographyWorkshop />}
            {report === 'Ticket Volume Over Time' && <ActivitiesUpcomingContent />}
            {report === 'Resolution Time Analysis' && <ActivitiesProductWebinar />}
            {report === 'Response Time Analysis' && <ActivitiesFollowersMilestone />}
            {report === 'Escalated Tickets Trend' && <ActivitiesProjectStatus />}
            {report === 'Agent Performance Report' && (
              <ActivitiesBloggingConference
                image={
                  <Fragment>
                    <img
                      src={toAbsoluteUrl(`/media/illustrations/3.svg`)}
                      className="dark:hidden max-h-[160px]"
                      alt=""
                    />
                    <img
                      src={toAbsoluteUrl(`/media/illustrations/3-dark.svg`)}
                      className="light:hidden max-h-[160px]"
                      alt=""
                    />
                  </Fragment>
                }
              />
            )}
            {report === 'Tickets by Category' && <ActivitiesDesignerWelcome />}
            {report === 'Tickets per Department / User Group' && <ActivitiesNewTeam />}
            {report === 'Top Repeated Issues' && <ActivitiesVirtualTeam />}
            <ActivitiesAnniversary />
          </div>
          <div className="card-footer justify-center">
            <a href="#" className="btn btn-link">
              All-time Activity
            </a>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-2.5" data-tabs="true">
        {reports.map((report, index) => (
          <a
            key={index}
            href="#"
            data-tab-toggle={`#activity_${report.replace(/\s+/g, '_')}`}
            className={`btn btn-sm text-gray-600 hover:text-primary tab-active:bg-primary-light tab-active:text-primary ${report === currentReport ? 'active' : ''
              }`}
            onClick={() => {
              setCurrentReport(report);
            }}
          >
            {report}
          </a>
        ))}
      </div>
    </Card>
    </div>
  );
};

export { AnalyticsRoot };
