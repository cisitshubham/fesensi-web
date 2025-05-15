import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function SupportPageUser() {
  const [reason, setreason] = useState('');
  const handlesubmit = () => {
    const formData = new FormData();
    formData.append('reason', reason);
  };
  return (
    <Card className="mx-8 flex flex-col p-4">
      <CardHeader>
        <h1 className="text-2xl font-bold">Support Page</h1>
        <p className="mt-2 text-gray-600">This is the support page for users</p>
      </CardHeader>
      <CardContent>
        <CardDescription></CardDescription>
        <form className='flex flex-col space-y-8'>
          <Textarea
            placeholder="Please enter your problem "
            value={reason}
            onChange={(e) => setreason(e.target.value)}
          />
          <Button onClick={handlesubmit} className='w-fit'>Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
