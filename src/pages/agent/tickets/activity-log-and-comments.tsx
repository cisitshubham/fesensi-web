import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem } from '@/components/accordion';
export default function ActivityLogAndComments() {
  return (
    <Card className=" ">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg">Activity Log</CardTitle>
      </CardHeader>
      <CardContent className=" h-[500px]  overflow-y-scroll  flex flex-col gap-4">
        {/* <Accordion className="w-full"> */}
        {/* <AccordionItem title={'show activity log'}> */}
        <Card >
          <CardHeader className="text-sm font-medium">Ticket Created</CardHeader>
          <CardContent className="">
            <div className="text-sm text-gray-500">2025-04-10 10:00 AM</div>
            <div className="text-sm text-gray-700">Ticket was created by John Doe.</div>
          </CardContent>
        </Card>
        <Card >
          <CardHeader className="text-sm font-medium">Ticket Created</CardHeader>
          <CardContent className="">
            <div className="text-sm text-gray-500">2025-04-10 10:00 AM</div>
            <div className="text-sm text-gray-700">Ticket was created by John Doe.</div>
          </CardContent>
        </Card>
        <Card >
          <CardHeader className="text-sm font-medium">Ticket Created</CardHeader>
          <CardContent className="">
            <div className="text-sm text-gray-500">2025-04-10 10:00 AM</div>
            <div className="text-sm text-gray-700">Ticket was created by John Doe.</div>
          </CardContent>
        </Card>
        <Card >
          <CardHeader className="text-sm font-medium">Ticket Created</CardHeader>
          <CardContent className="">
            <div className="text-sm text-gray-500">2025-04-10 10:00 AM</div>
            <div className="text-sm text-gray-700">Ticket was created by John Doe.</div>
          </CardContent>
        </Card>

        {/* </AccordionItem> */}
        {/* </Accordion> */}
      </CardContent>
      {/* <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion className="w-full">
          <AccordionItem title={'show activity log'}>
            <div className="border-b-2 border-gray-200">
              <div className="flex flex-row justify-between items-center py-2">
                <div className="text-sm font-medium">Ticket Created</div>
                <div className="text-sm text-gray-500">2025-04-10 10:00 AM</div>
              </div>
              <div className="text-sm text-gray-700">Ticket was created by John Doe.</div>
            </div>
          </AccordionItem>
        </Accordion>
      </CardContent> */}
    </Card>
  );
}
