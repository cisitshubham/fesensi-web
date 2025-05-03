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
    <Card style={{ padding: '20px' }} className='w-full flex flex-row justify-between shadow-lg'>
      <div style={{ marginBottom: '10px' }} className='my-auto'>
        <Button
          variant={selectedButton === 'Today' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Today')}
          style={{ marginRight: '10px' }}
        >
          Today
        </Button>
        <Button
          variant={selectedButton === 'Weekly' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Weekly')}
          style={{ marginRight: '10px' }}
        >
          Weekly
        </Button>
        <Button
          variant={selectedButton === 'Fortnightly' ? 'default' : 'outline'}
          onClick={() => handleButtonClick('Fortnightly')}
          style={{ marginRight: '10px' }}
        >
          Fortnightly
        </Button>
      </div>
      <div className='text-center my-auto'>
        <label style={{ marginRight: '10px' }}>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>
    </Card>
  );
}
