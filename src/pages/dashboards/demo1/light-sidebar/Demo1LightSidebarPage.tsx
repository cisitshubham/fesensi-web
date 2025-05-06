import {
  Fragment,
  useState,
  useEffect,
} from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Demo1LightSidebarContent } from './';
import { fetchUser } from '@/api/api';
import Tenure from '@/pages/charts/tenure';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Donut from '@/pages/charts/StatusDonut';
import Pie from '@/pages/charts/PriorityPie';
import { useRole } from '@/pages/global-components/role-context';
import { Card } from '@/components/ui/card';
import BarChart from '@/pages/charts/category-bar-chart';
import LineChart from '@/pages/charts/Volume-area-chart';

const Demo1LightSidebarPage = () => {
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
  }, []); // Removed dependencies to ensure fresh data is fetched every time

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
        <Demo1LightSidebarContent date={date} />
      </Container>


    </Fragment>
  );
};

export { Demo1LightSidebarPage };
