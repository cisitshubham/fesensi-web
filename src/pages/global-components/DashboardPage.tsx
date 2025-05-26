import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
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
      category: string;
      ticketCount: number;
      lastMonthCount: number;
      percentageChange: string;
    }>;
  };
}

interface CategoryCount {
  category: CategoryType;
  ticketCount: number;
  lastMonthCount: number;
  percentageChange: string;
}

interface DashboardResponse {
  statusData: number[];
  statusLabels: string[];
  categoryData: number[];
  categoryLabels: string[];
  priorityData: number[];
  priorityLabels: string[];
  ticketVolumeData: number[];
  ticketVolumeLabels: string[];
  ticketsbyCategory: {
    overallPercentageChange: string;
    totalTicketCount: number;
    totalLastMonthCount: number;
    counts: CategoryCount[];
  };
}

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20)
  });

  const [user, setUser] = useState<any>(null);
  const { selectedRoles, setSelectedRoles } = useRole();

  // Update handleRoleToggle to ensure roles are saved properly
  const handleRoleToggle = useCallback((role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles([]);
      sessionStorage.setItem('selectedRoles', JSON.stringify([]));
    } else {
      setSelectedRoles([role]);
      sessionStorage.setItem('selectedRoles', JSON.stringify([role]));
    }
    console.log('Selected Roles:', selectedRoles);
  }, [selectedRoles]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []);

  const roles = user?.role || [];

  // Update the logic to ensure selectedRoles are correctly saved and retrieved
  useEffect(() => {
    const storedRoles = sessionStorage.getItem('selectedRoles');
    console.log('Stored Roles:', storedRoles);

    let parsedRoles: string[] = [];
    try {
      parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];
    } catch {
      parsedRoles = [];
    }

    if (parsedRoles.length > 0) {
      setSelectedRoles(parsedRoles);
    } else {
      // Run your fallback logic
      if (roles.some((role: { role_name: string }) => role.role_name === 'AGENT')) {
        setSelectedRoles(['AGENT']);
        sessionStorage.setItem('selectedRoles', JSON.stringify(['AGENT']));
      } else if (roles.some((role: { role_name: string }) => role.role_name === 'ADMIN')) {
        setSelectedRoles(['ADMIN']);
        sessionStorage.setItem('selectedRoles', JSON.stringify(['ADMIN']));
      } else if (
        roles.length === 1 &&
        (roles.some((role: { role_name: string }) => role.role_name === 'CUSTOMER') ||
          roles.some((role: { role_name: string }) => role.role_name === 'USER'))
      ) {
        const roleNames = roles.map((role: { role_name: any }) => role.role_name);
        setSelectedRoles(roleNames);
        sessionStorage.setItem('selectedRoles', JSON.stringify(roleNames));
      }
    }
  }, [roles]);

  const isDropdownReadonly = useMemo(() => roles.length === 1, [roles.length]);

  const [ticketCounts, setTicketCounts] = useState({
    closed: 0,
    resolved: 0,
    inProgress: 0,
    open: 0,
    total: 1
  });

  const [ticketStatusTotal, setTicketStatusTotal] = useState(0);
  const [ticketStatusTotalPercentage, setTicketStatusTotalPercentage] = useState(0);

  const [categories, setCategories] = useState<CategoryCount[]>([]);

  const categoryIcons: Record<CategoryType, string> = {
    'Hardware': 'setting-2',
    'Internet/Network': 'data',
    'Cloud Technologies': 'cloud-change',
    'Software': 'soft',
    'Others': 'technology-4'
  };

  const renderCategory = useCallback((category: CategoryCount, index: number) => {
    return (
      <div key={index} className="flex items-center justify-between ">
        <div className="flex items-center">
          <span className="text-base text-gray-500">
            <i className={`icon-${categoryIcons[category.category] || 'clipboard-list'}`}></i>
          </span>
          <span className="text-sm font-normal text-gray-900">{category.category}</span>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-800 gap-4">
          <span className="lg:text-right">{category.ticketCount}</span>

          <span className="lg:text-right flex items-center gap-1  justify-end">
            {parseFloat(category.percentageChange) >= 0 ? (
              <span className="text-success">▲</span>
            ) : (
              <span className="text-danger">▼</span>
            )}
            {category.percentageChange}
          </span>
        </div>
      </div>
    );
  }, []);

  // Chart data states
  const [chartData, setChartData] = useState<ChartData>({
    statusData: [],
    statusLabels: [],
    priorityData: [],
    priorityLabels: [],
    ticketVolumeData: [],
    ticketVolumeLabels: [],
    categoryDataInprogress: [],
    categoryDataresolved: [],
    categoryLabels: [],
    ticketsbyCategory: {
      overallPercentageChange: '',
      totalTicketCount: 0,
      totalLastMonthCount: 0,
      counts: []
    }
  });

  const [tenureState, setTenureState] = useState({
    fromDate: '',
    toDate: '',
    selectedButton: 'Today',
  });

  useEffect(() => {
    // Default to 'Today'
    const today = new Date();
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };
    setTenureState({
      fromDate: formatDate(today),
      toDate: formatDate(today),
      selectedButton: 'Today',
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDashboardData(
          tenureState.fromDate,
          tenureState.toDate,
          selectedRoles[0]
        );
        if (response) {
          const { statusData, statusLabels, priorityData, priorityLabels, ticketVolumeData, ticketVolumeLabels, categoryDataInprogress, categoryDataresolved, categoryLabels, ticketsbyCategory } = response;
          const statusMap = (statusLabels as string[]).reduce((acc, label, index) => {
            acc[label] = (statusData as number[])[index];
            return acc;
          }, {} as Record<string, number>);
          setTicketCounts({
            resolved: statusMap['RESOLVED'] || 0,
            inProgress: statusMap['IN-PROGRESS'] || 0,
            open: statusMap['OPEN'] || 0,
            closed: statusMap['CLOSED'] || 0,
            total: (statusData as number[]).reduce((a: number, b: number) => a + b, 0) || 1
          });
          if (selectedRoles.includes('ADMIN') || selectedRoles.includes('AGENT')) {
            setTicketStatusTotal(ticketsbyCategory.totalTicketCount || 0);
            setTicketStatusTotalPercentage(parseFloat(ticketsbyCategory.overallPercentageChange));
            setCategories(ticketsbyCategory.counts);
          }
          setChartData({
            statusData: statusData as number[],
            statusLabels: statusLabels as string[],
            priorityData: priorityData as number[],
            priorityLabels: priorityLabels as string[],
            ticketVolumeData: ticketVolumeData as number[],
            ticketVolumeLabels: ticketVolumeLabels as string[],
            categoryDataInprogress: categoryDataInprogress as number[],
            categoryDataresolved: categoryDataresolved as number[],
            categoryLabels: categoryLabels as string[],
            ticketsbyCategory: ticketsbyCategory
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    if (selectedRoles.length > 0 && tenureState.fromDate && tenureState.toDate) {
      fetchData();
    }
  }, [selectedRoles, tenureState.fromDate, tenureState.toDate]);

  const percentages = useMemo(() => ({
    resolvedPercentage: (ticketCounts.resolved / ticketCounts.total) * 100,
    inProgressPercentage: (ticketCounts.inProgress / ticketCounts.total) * 100,
    openPercentage: (ticketCounts.open / ticketCounts.total) * 100
  }), [ticketCounts]);

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
              <Select onValueChange={(value) => handleRoleToggle(value)}>
                <SelectTrigger className="px-4 py-2 rounded-md hover:bg-primary/90 transition">
                  <SelectValue
                    placeholder={
                      selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles'
                    }
                  ></SelectValue>
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

      <Container >
        <Tenure
          fromDate={tenureState.fromDate}
          toDate={tenureState.toDate}
          selectedButton={tenureState.selectedButton}
          onChange={setTenureState}
        />

        <div className="flex flex-col lg:flex-row gap-6 ">
          {(selectedRoles.includes('ADMIN') || selectedRoles.includes('AGENT')) && (
            <div className="grid grid-cols-2 w-full lg:w-5/12  gap-4  ">
              <TicketStatusCards ticketCounts={ticketCounts} />
            </div>
          )}
          {(selectedRoles.includes('CUSTOMER') && (
            <div className="flex flex-row justify-between lg:gap-4 gap-1 w-full">
              <TicketStatusCards ticketCounts={ticketCounts} />
            </div>
          ))}

          <div className="w-full">
            {(selectedRoles.includes('ADMIN') || selectedRoles.includes('AGENT')) && (
              <TicketProgression
                ticketStatusTotal={ticketStatusTotal}
                ticketStatusTotalPercentage={ticketStatusTotalPercentage}
                resolvedPercentage={percentages.resolvedPercentage}
                inProgressPercentage={percentages.inProgressPercentage}
                openPercentage={percentages.openPercentage}
                categories={categories}
                renderCategory={renderCategory}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {(selectedRoles.includes('ADMIN') || selectedRoles.includes('AGENT')) && (
            <LineChart
              series={chartData.ticketVolumeData}
              labels={chartData.ticketVolumeLabels}
              key={`line-${chartData.ticketVolumeData.join('-')}`}
            />
          )}
          <Donut
            series={chartData.statusData}
            labels={chartData.statusLabels}
            key={`donut-${chartData.statusData.join('-')}`}
          />
          <Pie
            series={chartData.priorityData}
            labels={chartData.priorityLabels}
            key={`pie-${chartData.priorityData.join('-')}`}
          />
          {(selectedRoles.includes('ADMIN') || selectedRoles.includes('AGENT')) && (
            <BarChart
              resolved={chartData.categoryDataresolved}
              inprogress={chartData.categoryDataInprogress}
              labels={chartData.categoryLabels}
              key={`bar-${chartData.categoryDataresolved.join('-')}`}
            />
          )}
        </div>
      </Container>
    </Fragment>
  );
}