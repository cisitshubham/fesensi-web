import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TenureProps {
  fromDate: string;
  todate: string;
  selectedButton: string;
  onChange: (update: { fromDate: string; todate: string; selectedButton: string }) => void;
  isLoading?: boolean;
}

const Tenure = React.memo(function Tenure({ fromDate, todate, selectedButton, onChange, isLoading = false }: TenureProps) {
  // Button click handler
  const handleButtonClick = useCallback((button: string) => {
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
      fromDate: 
      formatDate(from),
      todate: formatDate(to),
      selectedButton: button,
    });
  }, [onChange, isLoading]);

  // Date input change handler
  const handleDateChange = useCallback((type: 'from' | 'to', value: string) => {
    if (isLoading) return;
    onChange({
      fromDate: type === 'from' ? value : fromDate,
      todate: type === 'to' ? value : todate,
      selectedButton
    });
  }, [onChange, isLoading, fromDate, todate, selectedButton]);

  // Memoize the buttons to prevent unnecessary re-renders
  const buttons = useMemo(() => (
    <>
      <Button
        variant={selectedButton === 'Today' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Today')}
        className={cn('mr-2 transition-all duration-200', isLoading && 'opacity-50 cursor-not-allowed')}
        disabled={isLoading}
      >
        Today
      </Button>
      <Button
        variant={selectedButton === 'Weekly' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Weekly')}
        className={cn('mr-2 transition-all duration-200', isLoading && 'opacity-50 cursor-not-allowed')}
        disabled={isLoading}
      >
        Weekly
      </Button>
      <Button
        variant={selectedButton === 'Fortnightly' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Fortnightly')}
        className={cn('mr-2 transition-all duration-200', isLoading && 'opacity-50 cursor-not-allowed')}
        disabled={isLoading}
      >
        Fortnightly
      </Button>
    </>
  ), [selectedButton, handleButtonClick, isLoading]);

  return (
    <Card className="p-4 sm:p-5 w-full flex flex-col sm:flex-row justify-between shadow-md my-4 gap-4">
      <div className="flex flex-wrap gap-2">
        {buttons}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <label className="flex items-center gap-2">
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleDateChange('from', e.target.value)}
            className={cn('transition-all duration-200', isLoading && 'opacity-50 cursor-not-allowed')}
            disabled={isLoading}
          />
        </label>
        <label className="flex items-center gap-2">
          To:
          <input
            type="date"
            value={todate}
            onChange={(e) => handleDateChange('to', e.target.value)}
            className={cn('transition-all duration-200', isLoading && 'opacity-50 cursor-not-allowed')}
            disabled={isLoading}
          />
        </label>
      </div>
    </Card>
  );
});

export default Tenure;
