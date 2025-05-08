import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SupportPageAgent() {
  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
      <Card className="mx-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-800">Agent Support Form</h2>
          <p className="text-sm text-gray-500 mt-1">Please provide details about the issue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlesubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="text"
                id="title"
                placeholder="Enter the Title of the issue"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Describe the issue in detail"
                className=""
                required
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="default"
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}
