import { Card, CardHeader } from '@/components/ui/card';

import { AnalyticsRoot } from '../components/analyticsbase';
export default function AnalyticsPage() {
  return (
    <div className="px-6">
      <CardHeader className='text-xl font-bold'>Analytics</CardHeader>
      <AnalyticsRoot />
    </div>
  );
}
