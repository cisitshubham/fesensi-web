import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Tenure() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedButton, setSelectedButton] = useState('Today');

  const handleButtonClick = (button: React.SetStateAction<string>) => {
    setSelectedButton(button);
  };

  return (
    <Card className="p-5 w-full flex flex-row justify-between shadow-lg my-4">
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
      <div className="text-center my-auto">
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
