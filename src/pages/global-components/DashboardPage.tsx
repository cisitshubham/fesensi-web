import { Fragment, useState, useEffect } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { fetchUser, getTicketByStatus, getTicketByCategory } from '@/api/api';
import { useRole } from '@/pages/global-components/role-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

// Import your chart components
import Tenure from '@/pages/charts/tenure';
import Donut from '@/pages/charts/donut';
import Pie from '@/pages/charts/pie';
import BarChart from '@/pages/charts/bar-chart';
import LineChart from '@/pages/charts/line-chart';

export default function  DashboardPage  () {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20)
  });

  const [user, setUser] = useState<any>(null);
  const { selectedRoles, setSelectedRoles } = useRole();

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles([]); // Clear the array if the role is already selected
    } else {
      setSelectedRoles([role]); // Set the array to only contain the selected role
      localStorage.setItem('selectedRole', role); // Store the selected role in local storage
    }
  };

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

  useEffect(() => {
    const storedRoles = localStorage.getItem('selectedRoles');

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
      if (roles.some((role: { role_name: string }) => role.role_name === 'ADMIN')) {
        setSelectedRoles(['ADMIN']);
      } else if (
        roles.length === 1 &&
        (roles.some((role: { role_name: string }) => role.role_name === 'CUSTOMER') ||
          roles.some((role: { role_name: string }) => role.role_name === 'USER'))
      ) {
        setSelectedRoles(roles.map((role: { role_name: any }) => role.role_name));
      } else if (roles.some((role: { role_name: string }) => role.role_name === 'AGENT')) {
        setSelectedRoles(['AGENT']);
      }
    }
  }, [roles]);

  const isDropdownReadonly = roles.length === 1;

  const [ticketCounts, setTicketCounts] = useState({
    resolved: 0,
    inProgress: 0,
    open: 0,
    total: 1
  });

  const [ticketStatusTotal, setTicketStatusTotal] = useState(0);
  const [ticketStatusTotalPercentage, setTicketStatusTotalPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTicketByStatus();

        let resolved = 0;
        let inProgress = 0;
        let open = 0;

        response.data.counts.forEach((item: { status: string; count: number; }) => {
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

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getTicketByCategory();
        setCategories(response.data.counts);
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const categoryIcons: Record<string, string> = {
    Hardware: 'setting-2',
    'Internet/Network': 'data',
    'Cloud Technologies': 'cloud-change',
    Software: 'soft',
    Others: 'technology-4'
  };

  const renderCategory = (category: any, index: number) => {
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
            {category.percentageChange >= 0 ? (
              <span className="text-success">▲</span>
            ) : (
              <span className="text-danger">▼</span>
            )}
            {category.percentageChange}
          </span>
        </div>
      </div>
    );
  };

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
                  <SelectValue placeholder={
                    selectedRoles.length > 0
                      ? selectedRoles.join(', ')
                      : 'Select Roles'
                  }>
                  </SelectValue>
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


        {/* Existing Dashboard Content */}
        <Tenure />
        <div className=" flex flex-row gap-4">
        <div className="grid grid-cols-2  gap-4 mb-6">
          <Card className="p-4 aspect-square">
            <h3 className="text-lg font-semibold mb-2">Total Tickets</h3>
            <p className="text-2xl font-bold">{ticketCounts.total}</p>
          </Card>
          <Card className="p-4 aspect-square">
            <h3 className="text-lg font-semibold mb-2">Open Tickets</h3>
            <p className="text-2xl font-bold">{ticketCounts.open}</p>
          </Card>
          <Card className="p-4 aspect-square">
            <h3 className="text-lg font-semibold mb-2">Resolved Tickets</h3>
            <p className="text-2xl font-bold">{ticketCounts.resolved}</p>
          </Card>
          <Card className="p-4 aspect-square">
            <h3 className="text-lg font-semibold mb-2">In-Progress Tickets</h3>
            <p className="text-2xl font-bold">{ticketCounts.inProgress}</p>
          </Card>
        </div>
        <div className="flex items-center gap-1 mb-2 w-full">
        <Card className="card-body flex flex-col gap-6 p-6 lg:p-8 lg:pt-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-600">Ticket Progression</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              Total Tickets: {ticketStatusTotal || 0}
            </span>
            <span className="badge badge-outline badge-success badge-sm">
              {ticketStatusTotalPercentage || 0}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          {ticketCounts.resolved > 0 && (
            <div
              className="bg-success h-2 rounded-md"
              style={{ width: `${resolvedPercentage}%` }}
            ></div>
          )}
          {ticketCounts.inProgress > 0 && (
            <div
              className="bg-info h-2 rounded-md"
              style={{ width: `${inProgressPercentage}%` }}
            ></div>
          )}
          {ticketCounts.open > 0 && (
            <div
              className="bg-primary h-2 rounded-md"
              style={{ width: `${openPercentage}%` }}
            ></div>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-5 mb-2">
          {[
            { badgeColor: 'bg-success', label: 'Resolved' },
            { badgeColor: 'bg-info', label: 'In Progress' },
            { badgeColor: 'bg-primary', label: 'Open' },
          ].map((item, index) => {
            return (
              <div key={index} className="flex items-center gap-1.5">
                <span className={`badge badge-dot size-2 ${item.badgeColor}`}></span>
                <span className="text-sm font-normal text-gray-800">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="border-b border-gray-300 my-4"></div>
        {categories.map(renderCategory)}
      </Card>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Donut />
          <Pie />
          <LineChart />
          <BarChart />
        </div>
      </Container>
    </Fragment>
  );
};

