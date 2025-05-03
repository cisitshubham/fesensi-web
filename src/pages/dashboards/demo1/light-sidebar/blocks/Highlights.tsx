import { KeenIcon, Menu, MenuItem } from '@/components';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n';
import { getTicketByCategory, getTicketByStatus } from '@/api/api';
import Donut from '@/pages/charts/donut';

interface IHighlightsRow {
  icon: string;
  text: string;
  total: number;
  stats: number;
  increase: boolean;
}
interface IHighlightsRows extends Array<IHighlightsRow> {}

interface IHighlightsItem {
  badgeColor: string;
  lebel: string;
}
interface IHighlightsItems extends Array<IHighlightsItem> {}

interface IHighlightsProps {
  limit?: number;
  date?: any;
}

const Highlights = ({ limit, date }: IHighlightsProps) => {
  const { isRTL } = useLanguage();
  const [rows, setRows] = useState<IHighlightsRow[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTicketByCategory();
        const categories = response.data.counts;
        let total = response.data.totalCurrentMonthCount || 0;
        let prevTotal = response.data.totalLastMonthCount || 0;
        const formattedRows: IHighlightsRow[] = categories.map((category: any) => {
          const previousCount = category.lastMonthCount || 0;
          const currentCount = category.ticketCount || 0;
          const increase = currentCount >= previousCount;
          const stats = parseFloat(category.percentageChange.replace('%', '')) || 0;
          return {
            icon: 'technology-4',
            text: category.category,
            total: currentCount,
            stats,
            increase
          };
        });

        setRows(formattedRows);
        setTotalTickets(total);
        setPercentageChange(prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0);
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
      }
    };
    fetchData();
  }, []);

  const [items, setItems] = useState<IHighlightsItem[]>([]);
  const [ticketStatus, setTicketStatus] = useState<IHighlightsItem[]>([]);
  const [ticketStatusLoading, setTicketStatusLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTicketByStatus();
        const categories = response.data.counts;
        const statusColors: Record<string, string> = {
          RESOLVED: 'badge-success',
          'IN-PROGRESS': 'badge-info',
          OPEN: 'badge-primary'
        };

        const statusOrder = ['RESOLVED', 'IN-PROGRESS', 'OPEN'];
        const formattedRows: IHighlightsItem[] = categories
          .map(({ status }: { status: string }) => ({
            badgeColor: statusColors[status] || 'badge-secondary',
            lebel: status
          }))
          .sort((a: any, b: any) => statusOrder.indexOf(a.lebel) - statusOrder.indexOf(b.lebel));
        setTicketStatus(formattedRows);
        setItems(formattedRows);
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
      } finally {
        setTicketStatusLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons: Record<string, string> = {
    Hardware: 'setting-2',
    'Internet/Network': 'data',
    'Cloud Technologies': 'cloud-change',
    Software: 'soft',
    Others: 'technology-4'
  };

  const renderRow = (row: IHighlightsRow, index: number) => {
    return (
      <div key={index} className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <KeenIcon
            icon={categoryIcons[row.text] || 'clipboard-list'}
            className="text-base text-gray-500"
          />
          <span className="text-sm font-normal text-gray-900">{row.text}</span>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-800 gap-6">
          <span className="lg:text-right">{row.total}</span>

          <span className="lg:text-right flex items-center gap-1 w-[60px] justify-end">
            {row.increase ? (
              <KeenIcon icon="arrow-up" className="text-success flex-shrink-0" />
            ) : (
              <KeenIcon icon="arrow-down" className="text-danger flex-shrink-0" />
            )}
            {row.stats}%
          </span>
        </div>
      </div>
    );
  };

  const [ticketCounts, setTicketCounts] = useState({
    resolved: 0,
    inProgress: 0,
    open: 0,
    total: 1
  });

  const [ticketStatusTotal, setTicketStatusTotal] = useState();
  const [ticketStatusTotalPercentage, setTicketStatusTotalPercentage] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTicketByStatus();

        let resolved = 0;
        let inProgress = 0;
        let open = 0;

        response.data.counts.forEach((item: any) => {
          if (item.status === 'RESOLVED') resolved = item.count;
          if (item.status === 'IN-PROGRESS') inProgress = item.count;
          if (item.status === 'OPEN') open = item.count;
        });

        const total = resolved + inProgress + open || 1;

        setTicketCounts({ resolved, inProgress, open, total });
        setTicketStatusTotal(response.data.totalCount);
        setTicketStatusTotalPercentage(response.data.percentageChange);
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
      }
    };

    fetchData();
  }, []);

  const resolvedPercentage = (ticketCounts.resolved / ticketCounts.total) * 100;
  const inProgressPercentage = (ticketCounts.inProgress / ticketCounts.total) * 100;
  const openPercentage = (ticketCounts.open / ticketCounts.total) * 100;

  const renderItem = (item: IHighlightsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1.5">
        <span className={`badge badge-dot size-2 ${item.badgeColor}`}></span>
        <span className="text-sm font-normal text-gray-800">{item.lebel}</span>
      </div>
    );
  };

  return (
    <div className="card h-full">
      <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-gray-700">Ticket Progression</span>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-semibold text-gray-900">
              Total Tickets: {ticketStatusTotal || 0}
            </span>
            <span className="badge badge-outline badge-success badge-sm">
              {ticketStatusTotalPercentage || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-1.5">
          {ticketCounts.resolved > 0 && (
            <div
              className="bg-success h-2 rounded-sm"
              style={{ width: `${resolvedPercentage}%` }}
            ></div>
          )}
          {ticketCounts.inProgress > 0 && (
            <div
              className="bg-info h-2 rounded-sm"
              style={{ width: `${inProgressPercentage}%` }}
            ></div>
          )}
          {ticketCounts.open > 0 && (
            <div
              className="bg-primary h-2 rounded-sm"
              style={{ width: `${openPercentage}%` }}
            ></div>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-4 mb-1">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>



        <div className="border-b border-gray-300"></div>
        <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
      </div>
    </div>
  );
};

export {
  Highlights,
  type IHighlightsRow,
  type IHighlightsRows,
  type IHighlightsItem,
  type IHighlightsItems,
  type IHighlightsProps
};
