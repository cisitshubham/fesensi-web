import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarClock } from "lucide-react";
import { CreateSupport } from "@/api/agent";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { map } from "leaflet";

export default function SupportPageAgent() {
  const dropdown = useMasterDropdown();
  const [email, setEmail] = useState(false);
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const [message, setMessage] = useState("");
  const [query_type, setQueryType] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // Combine date and time if they exist



    if(email) {
    
    }
    if (!email) {
       if (dateTime.date && dateTime.time) {
      const combinedDateTime = `${dateTime.date}T${dateTime.time}`;
      formData.set("calling_time", combinedDateTime);
    }

    
    }

    // Add message and query_type to formData
    formData.append("message", message);
    formData.append("query_type", query_type);
    
    const responce = await CreateSupport(formData);
    if (responce.success == true) {
      toast.success("Support request submitted successfully", { position: "top-center" });
      navigate("/");
    } else {
      toast.error("Failed to submit support request", { position: "top-center" });
    }
  };

  const isFormValid = email
    ? message.trim() !== ""
    : message.trim() !== "" && dateTime.date !== "" && dateTime.time !== "";

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
        <div className="mb-4">
          <Select value={query_type} onValueChange={(value) => setQueryType(value)}>
            <SelectTrigger>
              <span>{query_type ? dropdown.dropdownData.contactSupportOptions.find((option: { _id: string; title: string }) => option._id === query_type)?.title : "Select a query type"}</span>
            </SelectTrigger>
            <SelectContent>
              {dropdown.dropdownData.contactSupportOptions.map((query: { _id: string; title: string }) => (
                <SelectItem key={query._id} value={query._id}>
                  {query.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {email ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Describe your issue"
              required
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            />
            <Button type="submit" disabled={!isFormValid}>Submit</Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Custom DateTime Dropdown */}
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
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setDateTime((prev) => ({ ...prev, date: newDate }));
                      }}
                      name="date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Input
                      type="time"
                      className="justify-between"
                      placeholder="Select Time"
                      value={dateTime.time}
                      onChange={(e) => {
                        const newTime = e.target.value;
                        setDateTime((prev) => ({ ...prev, time: newTime }));
                      }}
                      name="time"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Textarea
              placeholder="Please enter your issue"
              required
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            />
            <Button type="submit" disabled={!isFormValid}>Submit</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
