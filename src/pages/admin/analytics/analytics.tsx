import { Card, CardHeader } from '@/components/ui/card';
import { Navbar } from '@/partials/navbar';
import { Tabs,TabsList,Tab,TabPanel } from '@/components';
export default function AnalyticsPage() {
  return (
    <Card className="">
      <CardHeader>Analytics</CardHeader>
      
      <Tabs>
        <TabsList>
          <Tab>Overview</Tab>
          <Tab>Details</Tab>
        </TabsList>
          <TabPanel >
            {/* Content for Overview */}
            <Navbar>Overview Content</Navbar>
          </TabPanel>
          <TabPanel>
            {/* Content for Details */}
            <Navbar>Details Content</Navbar>
          </TabPanel>
      </Tabs>
    </Card>
  );
}
