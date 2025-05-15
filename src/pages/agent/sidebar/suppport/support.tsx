import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarClock } from "lucide-react";

export default function SupportPageAgent() {
  const [email, setEmail] = useState(false);
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", { dateTime });
  };

  return (
    <Card className="mx-8">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-800">Agent Support Form</h2>
        <p className="text-sm text-gray-500 mt-1">Please provide details about the issue</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Button variant={email ? "default" : "outline"} onClick={() => setEmail(true)}>
            Email
          </Button>
          <Button variant={!email ? "default" : "outline"} onClick={() => setEmail(false)}>
            Phone
          </Button>
        </div>

        {email ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea placeholder="Describe your issue" required />
            <Button type="submit">Submit</Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="tel" placeholder="Phone Number" required />

            {/* Custom DateTime Dropdown */}
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1">Select Date and Time</label>
              <Popover>
                <PopoverTrigger asChild >
                  <Button variant="outline" className="w-full justify-between">
                    <span>
                      {dateTime.date && dateTime.time
                        ? `${dateTime.date} @ ${dateTime.time}`
                        : "Select Date & Time"}
                    </span>
                    <CalendarClock className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      type="date"
                      className="justify-between"
                      placeholder="Select Date"
                      value={dateTime.date}
                      onChange={(e) =>
                        setDateTime((prev) => ({ ...prev, date: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Input
                      type="time"
                      className="justify-between"
                      placeholder="Select Time"
                      value={dateTime.time}
                      onChange={(e) =>
                        setDateTime((prev) => ({ ...prev, time: e.target.value }))
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Textarea placeholder="Please enter your issue" required />
            <Button type="submit">Submit</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
