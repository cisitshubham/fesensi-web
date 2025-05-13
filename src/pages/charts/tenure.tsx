import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchDashboardData } from '@/pages/charts/data_manipulations';
import { useRole } from '@/pages/global-components/role-context';
import { cn } from '@/lib/utils';

const Tenure = React.memo(function Tenure({ onDataUpdate }: { onDataUpdate: (data: any) => void }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedButton, setSelectedButton] = useState('Today');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedRoles } = useRole();
  const lastFetchRef = useRef<{ fromDate: string; toDate: string; role: string } | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const formatDate = useCallback((date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }, []);

  // Memoize the date calculation logic
  const calculateDateRange = useCallback((button: string) => {
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

    return {
      from: formatDate(from),
      to: formatDate(to)
    };
  }, [formatDate]);

  // Effect to set initial dates and handle button changes
  useEffect(() => {
    const { from, to } = calculateDateRange(selectedButton);
    setFromDate(from);
    setToDate(to);
  }, [selectedButton, calculateDateRange]);

  // Memoize the fetch data function
  const fetchData = useCallback(async (retries = 3) => {
    if (!selectedRoles.length || !fromDate || !toDate) return;

    // Check if we've already fetched this exact data
    const currentFetch = { fromDate, toDate, role: selectedRoles[0] };
    if (
      lastFetchRef.current &&
      lastFetchRef.current.fromDate === currentFetch.fromDate &&
      lastFetchRef.current.toDate === currentFetch.toDate &&
      lastFetchRef.current.role === currentFetch.role
    ) {
      setIsButtonDisabled(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDashboardData(fromDate, toDate, selectedRoles[0]);
      
      if (data) {
        lastFetchRef.current = currentFetch;
        onDataUpdate(data);
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (retries > 0) {
        // Retry with exponential backoff
        setTimeout(() => {
          fetchData(retries - 1);
        }, 1000 * (3 - retries));
      } else {
        setError('Failed to fetch data. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  }, [fromDate, toDate, selectedRoles, onDataUpdate]);

  // Debounced effect for date changes with increased debounce time
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 1000); // Increased to 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [fromDate, toDate, selectedRoles, fetchData]);

  const handleButtonClick = useCallback((button: string) => {
    setIsButtonDisabled(true);
    setSelectedButton(button);
  }, []);

  const handleDateChange = useCallback((type: 'from' | 'to', value: string) => {
    if (type === 'from') {
      setFromDate(value);
    } else {
      setToDate(value);
    }
  }, []);

  // Memoize the buttons to prevent unnecessary re-renders
  const buttons = useMemo(() => (
    <>
      <Button
        variant={selectedButton === 'Today' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Today')}
        className={cn(
          "mr-2 transition-all duration-200",
          isButtonDisabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={isButtonDisabled}
      >
        Today
      </Button>
      <Button
        variant={selectedButton === 'Weekly' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Weekly')}
        className={cn(
          "mr-2 transition-all duration-200",
          isButtonDisabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={isButtonDisabled}
      >
        Weekly
      </Button>
      <Button
        variant={selectedButton === 'Fortnightly' ? 'default' : 'outline'}
        onClick={() => handleButtonClick('Fortnightly')}
        className={cn(
          "mr-2 transition-all duration-200",
          isButtonDisabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={isButtonDisabled}
      >
        Fortnightly
      </Button>
    </>
  ), [selectedButton, handleButtonClick, isButtonDisabled]);

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
            className={cn(
              "ml-1 transition-all duration-200",
              isButtonDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isButtonDisabled}
          />
        </label>
        <label className="ml-5">
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleDateChange('to', e.target.value)}
            className={cn(
              "ml-1 transition-all duration-200",
              isButtonDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isButtonDisabled}
          />
        </label>
        {error && (
          <span className="ml-4 text-sm text-red-500">{error}</span>
        )}
      </div>
    </Card>
  );
});

export default Tenure;
