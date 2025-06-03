import { Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { fetchUser, clearChartDataCache } from '@/api/api';
import { fetchDashboardData } from '@/pages/charts/data_manipulations';
import { useRole } from '@/pages/global-components/role-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import Tenure from '@/pages/charts/tenure';
import Donut from '@/pages/charts/StatusDonut';
import Pie from '@/pages/charts/PriorityPie';
import BarChart from '@/pages/charts/category-bar-chart';
import LineChart from '@/pages/charts/Volume-area-chart';
import TicketStatusCards from '@/pages/charts/TicketStatusCards';
import TicketProgression from '@/pages/charts/TicketProgression';
import { DashboardSkeleton } from '@/components/skeletons';

type CategoryType = 'Hardware' | 'Internet/Network' | 'Cloud Technologies' | 'Software' | 'Others';

interface ChartData {
  statusData: number[];
  statusLabels: string[];
  priorityData: number[];
  priorityLabels: string[];
  ticketVolumeData: number[];
  ticketVolumeLabels: string[];
  categoryDataInprogress: number[];
  categoryDataresolved: number[];
  categoryLabels: string[];
  ticketsbyCategory: {
    overallPercentageChange: string;
    totalTicketCount: number;
    totalLastMonthCount: number;
    counts: Array<{
      category: CategoryType;
      ticketCount: number;
      lastMonthCount: number;
      percentageChange: string;
    }>;
  };
}

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20)
  });

  const [user, setUser] = useState<any>(null);
  const { selectedRoles, setSelectedRoles } = useRole();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [tenureState, setTenureState] = useState(() => {
    const today = new Date();
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };
    return {
      fromDate: formatDate(today),
      toDate: formatDate(today),
      selectedButton: 'Today',
    };
  });

  const handleRoleToggle = useCallback(async (role: string) => {
    const newRoles = selectedRoles.includes(role) ? [role] : [role];
    setSelectedRoles(newRoles);
    localStorage.setItem('selectedRoles', JSON.stringify(newRoles));
    localStorage.setItem('selectedRole', role);
    window.dispatchEvent(new Event('storage'));
    
    // Clear chart data cache when switching roles
    clearChartDataCache();
    
    // Reset tenure state when switching roles
    const today = new Date();
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };
    const newTenureState = {
      fromDate: formatDate(today),
      toDate: formatDate(today),
      selectedButton: 'Today',
    };
    
    // Fetch new data immediately after role change
    setIsLoading(true);
    try {
      const response = await fetchDashboardData(
        newTenureState.fromDate,
        newTenureState.toDate,
        role
      );
      if (response) {
        setTenureState(newTenureState);
        setChartData(response as ChartData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRoles, setSelectedRoles]);

  // Combined initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchUser();
        setUser(userData.data);

        const storedRoles = localStorage.getItem('selectedRoles');
        let parsedRoles: string[] = [];
        
        try {
          parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];
        } catch {
          parsedRoles = [];
        }

        const roles = userData.data.role || [];
        let newRoles: string[] = [];

        if (parsedRoles.length > 0) {
          newRoles = parsedRoles;
        } else {
          if (roles.some((role: { role_name: string }) => role.role_name === 'AGENT')) {
            newRoles = ['AGENT'];
            localStorage.setItem('selectedRole', 'AGENT');
          } else if (roles.some((role: { role_name: string }) => role.role_name === 'ADMIN')) {
            newRoles = ['ADMIN'];
            localStorage.setItem('selectedRole', 'ADMIN');
          } else if (
            roles.length === 1 &&
            (roles.some((role: { role_name: string }) => role.role_name === 'CUSTOMER') ||
            roles.some((role: { role_name: string }) => role.role_name === 'USER'))
          ) {
            newRoles = roles.map((role: { role_name: any }) => role.role_name);
          }
          
          if (newRoles.length > 0) {
            localStorage.setItem('selectedRoles', JSON.stringify(newRoles));
            localStorage.setItem('selectedRole', JSON.stringify(newRoles));
          }
        }

        setSelectedRoles(newRoles);

        if (newRoles.length > 0 && tenureState.fromDate && tenureState.toDate) {
          const response = await fetchDashboardData(
            tenureState.fromDate,
            tenureState.toDate,
            newRoles[0]
          );
          if (response) {
            setChartData(response as ChartData);
          }
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    initializeData();
  }, []);

  // Fetch dashboard data when roles and dates change (after initial load)
  useEffect(() => {
    if (isInitialLoad || !selectedRoles.length || !tenureState.fromDate || !tenureState.toDate) return;
    
    const fetchData = async () => {
      const isRoleChange = selectedRoles !== prevRolesRef.current;
      if (isRoleChange) {
        setIsLoading(true);
      }
      
      try {
        const response = await fetchDashboardData(
          tenureState.fromDate,
          tenureState.toDate,
          selectedRoles[0]
        );
        if (response) {
          setChartData(response as ChartData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (isRoleChange) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedRoles, tenureState.fromDate, tenureState.toDate, isInitialLoad]);

  // Add a ref to track previous roles
  const prevRolesRef = useRef(selectedRoles);
  useEffect(() => {
    prevRolesRef.current = selectedRoles;
  }, [selectedRoles]);

  // Add debug logs for chart data
  useEffect(() => {
    if (chartData) {
      const debugData = {
        statusData: chartData.statusData,
        statusLabels: chartData.statusLabels,
        priorityData: chartData.priorityData,
        priorityLabels: chartData.priorityLabels,
        categoryDataInprogress: chartData.categoryDataInprogress,
        categoryDataresolved: chartData.categoryDataresolved,
        categoryLabels: chartData.categoryLabels
      };
      console.log('Chart data updated:', debugData);
    }
  }, [chartData]);

  const roles = user?.role || [];

  const isDropdownReadonly = roles.length === 1;

  // Direct calculations without useMemo
  const ticketCounts = !chartData ? {
    resolved: 0,
    inProgress: 0,
    open: 0,
    closed: 0,
    total: 0,
    hasData: false
  } : (() => {
    const statusMap = chartData.statusLabels.reduce((acc, label, index) => {
      acc[label] = chartData.statusData[index];
      return acc;
    }, {} as Record<string, number>);

    const total = chartData.statusData.reduce((a, b) => a + b, 0);
    return {
      resolved: statusMap['RESOLVED'] || 0,
      inProgress: statusMap['IN-PROGRESS'] || 0,
      open: statusMap['OPEN'] || 0,
      closed: statusMap['CLOSED'] || 0,
      total: total,
      hasData: total > 0
    };
  })();

  const percentages = {
    resolvedPercentage: ticketCounts.hasData ? (ticketCounts.resolved / ticketCounts.total) * 100 : 0,
    inProgressPercentage: ticketCounts.hasData ? (ticketCounts.inProgress / ticketCounts.total) * 100 : 0,
    openPercentage: ticketCounts.hasData ? (ticketCounts.open / ticketCounts.total) * 100 : 0,
    hasData: ticketCounts.hasData
  };

  const isAdminOrAgent = selectedRoles.includes('ADMIN') || selectedRoles.includes('AGENT');
  const isCustomer = selectedRoles.includes('CUSTOMER');

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Dashboard" description="Central Hub for Comprehensive View" />
          <ToolbarActions>
            {isDropdownReadonly ? (
              <div className="px-4 py-2 rounded-md bg-gray-200 text-gray-500">
                {roles.length > 0 ? roles[0].role_name : 'Select Roles'}
              </div>
            ) : (
              <Select 
                onValueChange={(value) => {
                  handleRoleToggle(value);
                }}
              >
                <SelectTrigger className="px-4 py-2 rounded-md hover:bg-primary/90 transition">
                  <SelectValue
                    placeholder={
                      selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="mt-2 shadow-lg rounded-md">
                  {roles.map(({ _id, role_name }: { _id: string; role_name: string }) => (
                    <SelectItem
                      key={_id}
                      value={role_name}
                      className={cn(
                        'cursor-pointer hover:bg-primary rounded-md flex flex-row justify-between gap-2',
                        selectedRoles.includes(role_name) && 'bg-primary-light text-primary'
                      )}
                    >
                      {role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <Tenure
          fromDate={tenureState.fromDate}
          toDate={tenureState.toDate}
          selectedButton={tenureState.selectedButton}
          onChange={setTenureState}
          isLoading={isLoading}
        />

        {!isLoading && (
          <>
            <div className="flex flex-col lg:flex-row gap-6">
              {(isAdminOrAgent || isCustomer) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 w-full lg:w-5/12 gap-4">
                  <TicketStatusCards 
                    ticketCounts={ticketCounts} 
                    key={`status-cards-${JSON.stringify(ticketCounts)}`}
                  />
                </div>
              )}

              {isAdminOrAgent && chartData && chartData.ticketsbyCategory && (
                <div className="w-full">
                  <TicketProgression
                    ticketStatusTotal={chartData.ticketsbyCategory.totalTicketCount}
                    ticketStatusTotalPercentage={parseFloat(chartData.ticketsbyCategory.overallPercentageChange)}
                    resolvedPercentage={percentages.resolvedPercentage}
                    inProgressPercentage={percentages.inProgressPercentage}
                    openPercentage={percentages.openPercentage}
                    categories={chartData.ticketsbyCategory.counts}
                    key={`progression-${JSON.stringify(chartData.ticketsbyCategory)}`}
                    renderCategory={(category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-base text-gray-500">
                            <i className={`icon-${category.category.toLowerCase()}`}></i>
                          </span>
                          <span className="text-sm font-normal text-gray-900">{category.category}</span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-gray-800 gap-4">
                          <span className="lg:text-right">{category.ticketCount}</span>
                          <span className="lg:text-right flex items-center gap-1 justify-end">
                            {parseFloat(category.percentageChange) >= 0 ? (
                              <span className="text-success">▲</span>
                            ) : (
                              <span className="text-danger">▼</span>
                            )}
                            {category.percentageChange}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {isAdminOrAgent && chartData && (
                <div className="w-full h-[350px]">
                  <LineChart
                    series={chartData.ticketVolumeData}
                    labels={chartData.ticketVolumeLabels}
                    key={`line-${JSON.stringify(chartData.ticketVolumeData)}-${JSON.stringify(chartData.ticketVolumeLabels)}`}
                  />
                </div>
              )}
              {chartData && (
                <div className="w-full h-[350px]">
                  <Donut
                    series={chartData.statusData}
                    labels={chartData.statusLabels}
                    key={`donut-${JSON.stringify(chartData.statusData)}-${JSON.stringify(chartData.statusLabels)}`}
                  />
                </div>
              )}
              {chartData && (
                <div className="w-full h-[350px]">
                  <Pie
                    series={chartData.priorityData}
                    labels={chartData.priorityLabels}
                    key={`pie-${JSON.stringify(chartData.priorityData)}-${JSON.stringify(chartData.priorityLabels)}`}
                  />
                </div>
              )}
              {isAdminOrAgent && chartData && (
                <div className="w-full h-[350px]">
                  <BarChart
                    resolved={chartData.categoryDataresolved}
                    inprogress={chartData.categoryDataInprogress}
                    labels={chartData.categoryLabels}
                    key={`bar-${JSON.stringify(chartData.categoryDataresolved)}-${JSON.stringify(chartData.categoryDataInprogress)}-${JSON.stringify(chartData.categoryLabels)}`}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </Fragment>
  );
}