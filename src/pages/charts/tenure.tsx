import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchDashboardData } from '@/pages/charts/data_manipulations';
import { useRole } from '@/pages/global-components/role-context';

export default function Tenure({ onDataUpdate }: { onDataUpdate: (data: any) => void }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedButton, setSelectedButton] = useState('Today');
  const { selectedRoles } = useRole();

  const formatDate = useCallback((date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }, []);

  // Effect to set initial dates and handle button changes
  useEffect(() => {
    const today = new Date();
    
    if (selectedButton === 'Today') {
      setFromDate(formatDate(today));
      setToDate(formatDate(today));
    } else if (selectedButton === 'Weekly') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      setFromDate(formatDate(oneWeekAgo));
      setToDate(formatDate(today));
    } else if (selectedButton === 'Fortnightly') {
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(today.getDate() - 14);
      setFromDate(formatDate(twoWeeksAgo));
      setToDate(formatDate(today));
    }
  }, [selectedButton, formatDate]);

  // Effect to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedRoles.length || !fromDate || !toDate) return;
        
        const data = await fetchDashboardData(fromDate, toDate, selectedRoles[0]);
        if (data) {
          onDataUpdate(data);
        } else {
          console.error('API did not return success:', data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    // Add a small debounce to prevent rapid consecutive calls
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fromDate, toDate, selectedRoles, onDataUpdate]);

  const handleButtonClick = (button: React.SetStateAction<string>) => {
    setSelectedButton(button);
  };

  return (
    <Card className="p-5 w-full flex flex-row justify-between shadow-md my-4">
      <div className="mb-2 my-auto">
        <Button
          variant={selectedButton === 'Today' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Today')}
          className="mr-2"
        >
          Today
        </Button>
        <Button
          variant={selectedButton === 'Weekly' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Weekly')}
          className="mr-2"
        >
          Weekly
        </Button>
        <Button
          variant={selectedButton === 'Fortnightly' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Fortnightly')}
          className="mr-2"
        >
          Fortnightly
        </Button>
      </div>
      
      <div>
        <label className="mr-2">
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="ml-1"
          />
        </label>
        <label className="ml-5">
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="ml-1"
          />
        </label>
      </div>
    </Card>
  );
}
