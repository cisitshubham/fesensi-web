import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TenureProps {
  fromDate: string;
  toDate: string;
  selectedButton: string;
  onChange: (update: { fromDate: string; toDate: string; selectedButton: string }) => void;
}

const Tenure = React.memo(function Tenure({ fromDate, toDate, selectedButton, onChange }: TenureProps) {
  // Button click handler
  const handleButtonClick = useCallback((button: string) => {
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
      toDate: formatDate(to),
      selectedButton: button,
    });
  }, [onChange]);

  // Date input change handler
  const handleDateChange = useCallback((type: 'from' | 'to', value: string) => {
    if (type === 'from') {
      onChange({ fromDate: value, toDate, selectedButton });
    } else {
      onChange({ fromDate, toDate: value, selectedButton });
    }
  }, [fromDate, toDate, selectedButton, onChange]);

  // Memoize the buttons to prevent unnecessary re-renders
  const buttons = useMemo(() => (
    <>
      <Button
        variant={selectedButton === 'Today' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Today')}
        className={cn('mr-2 transition-all duration-200')}
      >
        Today
      </Button>
      <Button
        variant={selectedButton === 'Weekly' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Weekly')}
        className={cn('mr-2 transition-all duration-200')}
      >
        Weekly
      </Button>
      <Button
        variant={selectedButton === 'Fortnightly' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Fortnightly')}
        className={cn('mr-2 transition-all duration-200')}
      >
        Fortnightly
      </Button>
    </>
  ), [selectedButton, handleButtonClick]);

  return (
    <Card className="p-5 w-full flex flex-row justify-between shadow-md my-4">
      <div className="mb-2 my-auto">
        {buttons}
      </div>
      <div>
        <label className="mr-2">
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleDateChange('from', e.target.value)}
            className={cn('ml-1 transition-all duration-200')}
          />
        </label>
        <label className="ml-5">
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleDateChange('to', e.target.value)}
            className={cn('ml-1 transition-all duration-200')}
          />
        </label>
      </div>
    </Card>
  );
});

export default Tenure;
