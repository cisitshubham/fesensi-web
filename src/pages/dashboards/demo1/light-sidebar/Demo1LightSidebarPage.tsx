import {
  Fragment,
  useState,
  useEffect,
} from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Demo1LightSidebarContent } from './';
import { fetchUser } from '@/api/api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { KeenIcon } from '@/components/keenicons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/pages/global-components/role-context';

const Demo1LightSidebarPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20)
  });

  const [user, setUser] = useState<any>(null);
  const { selectedRoles, setSelectedRoles } = useRole();

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
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

  const roles = ['CUSTOMER', 'AGENT', 'ADMIN'];

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Dashboard" description="Central Hub for Comprehensive View" />
          <ToolbarActions>
            <Select onValueChange={(value) => handleRoleToggle(value)}>
              <SelectTrigger className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition">
                <SelectValue placeholder="Select Roles">
                  {selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="mt-2 w-48 bg-primary text-primary-foreground shadow-lg rounded-md p-1">
                {roles.map((role, index) => (
                  <SelectItem
                    key={index}
                    value={role}
                    className={cn(
                      'cursor-pointer px-3 py-2 hover:bg-primary-light rounded-md',
                      selectedRoles.includes(role) && 'bg-primary-light'
                    )}
                  >
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    'btn btn-sm btn-light data-[state=open]:bg-light-active',
                    !date && 'text-gray-400'
                  )}
                >
                  <KeenIcon icon="calendar" className="me-0.5" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
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
