import { Fragment, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { fetchUser } from '@/api/api';
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
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DashboardAgent = () => {
 
  const [user, setUser] = useState<any>(null);
  const { selectedRoles, setSelectedRoles } = useRole();
  const [chartData, setChartData] = useState<any>(null);
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
      todate: formatDate(today),
      selectedButton: 'Today',
    };
  });
  const navigate = useNavigate();

  const handleRoleToggle = useCallback(async (role: string) => {
    setSelectedRoles([role]);
    localStorage.setItem('selectedRoles', JSON.stringify([role]));
    localStorage.setItem('selectedRole', role);
    window.dispatchEvent(new Event('storage'));
    // Redirect based on selectedRole
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'AGENT') navigate('/agent/dashboard');
    else if (role === 'USER' || role === 'CUSTOMER') navigate('/user/dashboard');
    if (!isInitialLoad) {
      setIsLoading(true);
      try {
        const response = await fetchDashboardData(
          tenureState.fromDate,
          tenureState.todate,
          role
        );
        if (response) {
          setChartData(response);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [setSelectedRoles, tenureState.fromDate, tenureState.todate, isInitialLoad, navigate]);

  useEffect(() => {
    const initializeData = async () => {
      if (!isInitialLoad) return;
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
        // Force default to AGENT
        if (!newRoles.includes('AGENT')) {
          newRoles = ['AGENT'];
          localStorage.setItem('selectedRoles', JSON.stringify(newRoles));
          localStorage.setItem('selectedRole', 'AGENT');
        }
        setSelectedRoles(newRoles);
        if (newRoles.length > 0 && tenureState.fromDate && tenureState.todate) {
          const response = await fetchDashboardData(
            tenureState.fromDate,
            tenureState.todate,
            newRoles[0]
          );
          if (response) {
            setChartData(response);
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

  useEffect(() => {
    if (!selectedRoles.length || !tenureState.fromDate || !tenureState.todate || isInitialLoad) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchDashboardData(
          tenureState.fromDate,
          tenureState.todate,
          selectedRoles[0]
        );
        if (response) {
          setChartData(response);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedRoles, tenureState.fromDate, tenureState.todate, isInitialLoad]);

  const prevRolesRef = useRef(selectedRoles);
  useEffect(() => {
    prevRolesRef.current = selectedRoles;
  }, [selectedRoles]);

  useEffect(() => {
    if (chartData) {
      // debug
    }
  }, [chartData]);

  const roles = user?.role || [];
  const isDropdownReadonly = roles.length === 1;
  const ticketCounts = useMemo(() => {
    if (!chartData) {
      return {
        resolved: 0,
        inProgress: 0,
        open: 0,
        closed: 0,
        total: 0,
        hasData: false
      };
    }
    const statusMap = chartData.statusLabels.reduce((acc: any, label: string, index: number) => {
      acc[label] = chartData.statusData[index];
      return acc;
    }, {} as Record<string, number>);
    const total = chartData.statusData.reduce((a: number, b: number) => a + b, 0);
    return {
      resolved: statusMap['RESOLVED'] || 0,
      inProgress: statusMap['IN-PROGRESS'] || 0,
      open: statusMap['OPEN'] || 0,
      closed: statusMap['CLOSED'] || 0,
      total: total,
      hasData: total > 0
    };
  }, [chartData]);
  const percentages = useMemo(() => ({
    resolvedPercentage: ticketCounts.hasData ? (ticketCounts.resolved / ticketCounts.total) * 100 : 0,
    inProgressPercentage: ticketCounts.hasData ? (ticketCounts.inProgress / ticketCounts.total) * 100 : 0,
    openPercentage: ticketCounts.hasData ? (ticketCounts.open / ticketCounts.total) * 100 : 0,
    hasData: ticketCounts.hasData
  }), [ticketCounts]);
  const isAdminOrAgent = selectedRoles.includes('ADMIN') || selectedRoles.includes('AGENT');
  const isCustomer = selectedRoles.includes('CUSTOMER');
  if (isLoading && isInitialLoad) {
    return <DashboardSkeleton />;
  }
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Agent Dashboard" description="Central Hub for Agent View" />
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
                key={`role-select-${selectedRoles.join('-')}`}
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
          todate={tenureState.todate}
          selectedButton={tenureState.selectedButton}
          onChange={(newState) => {
            setTenureState(newState);
          }}
          isLoading={isLoading}
        />
        <div className="flex flex-col lg:flex-row gap-6">
          {(isAdminOrAgent || isCustomer) && (
            <div className="grid grid-cols-2 w-full lg:w-5/12 gap-4">
              <TicketStatusCards 
                ticketCounts={ticketCounts} 
                dateRange={{ fromDate: tenureState.fromDate, todate: tenureState.todate }}
              />
            </div>
          )}
          {chartData  && (
            <div className="w-full">
              <TicketProgression
                ticketStatusTotal={chartData.ticketsbyCategory.totalTicketCount}
                ticketStatusTotalPercentage={parseFloat(chartData.ticketsbyCategory.overallPercentageChange)}
                resolvedPercentage={percentages.resolvedPercentage}
                inProgressPercentage={percentages.inProgressPercentage}
                openPercentage={percentages.openPercentage}
                categories={chartData.ticketsbyCategory.counts}
                renderCategory={(category: any, index: number) => {
                  const isPositive = Number.parseFloat(category.percentageChange) >= 0;
                  return (
                  <div
                  key={`category-${category.category}-${index}`}
                  className="flex items-center justify-between  rounded-md transition-colors duration-150"
                >
                  <div className="flex items-center">
                 
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  </div>
            
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-right">{category.ticketCount}</span>
            
                    <div className="flex items-center gap-1 min-w-[4rem] justify-end">
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                        {Math.abs(Number.parseFloat(category.percentageChange))}%
                      </span>
                    </div>
                  </div>
                </div>
                  );
                }}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-12 sm:mt-16">
          {isAdminOrAgent && chartData && (
            <div className="w-full min-h-[400px] h-[450px]">
               <LineChart
                series={chartData.ticketVolumeData}
                labels={chartData.ticketVolumeLabels}
              />
            </div>
          )}
          {chartData && (
            <div className="w-full min-h-[400px] h-[450px]">
              <Donut
                series={chartData.statusData}
                labels={chartData.statusLabels}
              />
            </div>
          )}
          {chartData && (
            <div className="w-full min-h-[400px] h-[450px]">
              <Pie
                series={chartData.priorityData}
                labels={chartData.priorityLabels}
              />
            </div>
          )}
          {isAdminOrAgent && chartData && (
            <div className="w-full min-h-[400px] h-[450px]">
              <BarChart
                resolved={chartData.categoryDataresolved}
                inprogress={chartData.categoryDataInprogress}
                labels={chartData.categoryLabels}
              />
            </div>
          )}
        </div>
      </Container>
    </Fragment>
  );
};

export default DashboardAgent; 