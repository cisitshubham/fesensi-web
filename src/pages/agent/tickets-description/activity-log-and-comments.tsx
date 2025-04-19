import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem } from '@/components/accordion';
import { Separator } from '@/components/ui/separator';

export default function ActivityLogAndComments() {
  return (
    <Card className="flex flex-col overflow-y-auto no-scrollbar max-h-[580px]">
      {/* Activity Log Section */}
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">Activity Log</CardTitle>
      </CardHeader>
      <div className="overflow-y-auto  max-h-[480px] px-4">
        <Accordion className="w-full space-y-4">
          <AccordionItem title="Show Activity Log">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="text-sm font-medium">Ticket Created</CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">2025-04-10 10:00 AM</div>
                  <div className="text-sm text-gray-700">Ticket was created by John Doe.</div>
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
      <div className="overflow-y-auto  max-h-[480px] px-4">
        <Accordion className="w-full">
          <AccordionItem title="Show Comments">
            <div className="border-b-2 border-gray-200 py-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Ticket Created</div>
                <div className="text-sm text-gray-500">2025-04-10 10:00 AM</div>
              </div>
              <div className="text-sm text-gray-700">Ticket was created by John Doe.</div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
}
