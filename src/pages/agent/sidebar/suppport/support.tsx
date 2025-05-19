import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarClock } from "lucide-react";
import { CreateSupport } from "@/api/agent";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context";

export default function SupportPageAgent() {
  const [email, setEmail] = useState(false);
  const { dropdownData } = useMasterDropdown();
  const [selectedSupportOption, setSelectedSupportOption] = useState<string>("");
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const [issue, setIssue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (email) {
    } else {
      const callingTime = dateTime.date && dateTime.time ? `${dateTime.date} ${dateTime.time}` : dateTime.date;
      formData.append("calling_time", callingTime);
    }
    formData.append("message", issue);
    formData.append("query_type", selectedSupportOption);

    const responce = await CreateSupport(formData);
    if (responce.success == true) {
      toast.success("Support request submitted successfully", { position: "top-center" });
      navigate("/");
    } else {
      toast.error("Failed to submit support request", { position: "top-center" });
    }
  };

  return (
    <Card className="mx-8">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-800"> Support Form</h2>
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
            <Select value={selectedSupportOption} onValueChange={setSelectedSupportOption} required>
              <SelectTrigger>
                <SelectValue placeholder="Select support type" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.contactSupportOptions.map((item: { _id: string, title: string }) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Describe your issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            />
            <Button type="submit">Submit</Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select value={selectedSupportOption} onValueChange={setSelectedSupportOption} required>
              <SelectTrigger>
                <SelectValue placeholder="Select support type" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.contactSupportOptions.map((item: { _id: string, title: string }) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1">Select Date and Time</label>
              <Popover>
                <PopoverTrigger asChild>
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
            <Textarea
              placeholder="Please enter your issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            />
            <Button type="submit">Submit</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
