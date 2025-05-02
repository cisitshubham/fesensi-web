import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem } from '@/components/accordion';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface ActivityLog {
  action: string;
  createdAt: string;
  details: string;
  creator: {
    _id: string;
    first_name: string;
  };
}

interface AgentComment {
  _id: string;
  comment_text: string;
  creator: string;
  role: string;
  createdAt: string;
}

// Utility function to format date
const formatDate = (dateString: string | undefined | null) => {
  if (typeof dateString === 'string') return dateString; // Directly return if it's already a string
  if (!dateString) return 'Invalid Date'; // Handle null or undefined dates
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date strings
  return format(date, 'PPpp'); // Example: Apr 23, 2025, 10:38 AM
};

export default function ActivityLogAndComments({
  activityLog,
  agentComments,
}: {
  activityLog: ActivityLog[];
  agentComments: AgentComment[];
}) {

  console.log(activityLog, 'activityLog');

  return (
    <Card className="flex flex-col overflow-y-auto no-scrollbar max-h-[580px]">
      {/* Activity Log Section */}
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">Activity Log</CardTitle>
      </CardHeader>
      <div className="overflow-y-auto max-h-[480px] px-4">
        <Accordion className="w-full space-y-4">
          <AccordionItem title="Show Activity Log">
            {activityLog.map((log, index) => (
              <Card key={index}>
                <CardHeader className="text-sm font-medium">{log.action}</CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">createdAt:{log.createdAt}</div>
                  <div className="text-sm text-gray-700">{log.creator.first_name}</div>
                </CardContent>
              </Card>
            ))}
          </AccordionItem>
        </Accordion>
      </div>

      <Separator className="my-4" />

      {/* Comments Section */}
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <div className="overflow-y-auto max-h-[480px] px-4">
        <Accordion className="w-full">
          <AccordionItem title="Show Comments">
            {agentComments.map((comment) => (
              <div key={comment._id} className="border-b-2 border-gray-200 py-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">{comment.creator}</div>
                  <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                </div>
                <div className="text-sm text-gray-700">{comment.comment_text}</div>
              </div>
            ))}
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
}
