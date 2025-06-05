import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format, subMonths } from 'date-fns';
import { KeenIcon } from '@/components';

interface TenureProps {
  fromDate: string;
  todate: string;
  selectedButton: string;
  onChange: (update: { fromDate: string; todate: string; selectedButton: string }) => void;
  isLoading?: boolean;
}

const Tenure = React.memo(function Tenure({
  fromDate,
  todate,
  selectedButton,
  onChange,
  isLoading = false
}: TenureProps) {
  // Convert string dates to Date objects for the calendar
  const dateRange: DateRange | undefined = useMemo(() => {
    if (!fromDate || !todate) return undefined;
    return {
      from: new Date(fromDate),
      to: new Date(todate)
    };
  }, [fromDate, todate]);

  // Calculate the minimum allowed date (6 months ago from today)
  const minDate = useMemo(() => subMonths(new Date(), 6), []);
  
  // Get today's date for maximum allowed date
  const maxDate = useMemo(() => new Date(), []);

  // Button click handler
  const handleButtonClick = useCallback(
    (button: string) => {
      if (isLoading) return;
      // Calculate new date range based on button
      const today = new Date();
      let from = today;
      let to = today;
      if (button === 'Weekly') {
        from = new Date(today);
        from.setDate(today.getDate() - 7);
      } else if (button === 'Fortnightly') {
        from = new Date(today);
        from.setDate(today.getDate() - 14);
      }
      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };
      onChange({
        fromDate: formatDate(from),
        todate: formatDate(to),
        selectedButton: button
      });
    },
    [onChange, isLoading]
  );

  // Date range change handler
  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      if (isLoading || !range?.from) return;
      
      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };

      onChange({
        fromDate: formatDate(range.from),
        todate: range.to ? formatDate(range.to) : formatDate(range.from),
        selectedButton: 'Custom'
      });
    },
    [onChange, isLoading]
  );

  // Memoize the buttons to prevent unnecessary re-renders
  const buttons = useMemo(
    () => (
      <>
        <Button
          variant={selectedButton === 'Today' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Today')}
          className={cn(
            'mr-2 transition-all duration-200',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          disabled={isLoading}
        >
          Today
        </Button>
        <Button
          variant={selectedButton === 'Weekly' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Weekly')}
          className={cn(
            'mr-2 transition-all duration-200',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          disabled={isLoading}
        >
          Weekly
        </Button>
        <Button
          variant={selectedButton === 'Fortnightly' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Fortnightly')}
          className={cn(
            'mr-2 transition-all duration-200',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          disabled={isLoading}
        >
          Fortnightly
        </Button>
      </>
    ),
    [selectedButton, handleButtonClick, isLoading]
  );

  return (
    <Card className="p-4 sm:p-5 w-full flex flex-col sm:flex-row justify-between shadow-md my-4 gap-4">
      <div className="flex flex-wrap gap-2">{buttons}</div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <Popover>
          <PopoverTrigger asChild>
            <button
              id="date"
              className={cn(
                'btn btn-sm',
                selectedButton === 'Custom' 
                  ? 'btn-primary text-white data-[state=open]:bg-primary data-[state=open]:text-white' 
                  : 'btn-light text-gray-700 data-[state=open]:bg-light-active',
                !dateRange && 'text-gray-400',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              disabled={isLoading}
            >
              <KeenIcon icon="calendar" className="me-0.5" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
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
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              disabled={{ before: minDate, after: maxDate }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
});

export default Tenure;
