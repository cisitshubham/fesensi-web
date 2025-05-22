import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CardHeader } from "@mui/material";

export default function SupportPageAdmin() {
  return (
    <Card className="flex flex-col p-4 mx-8">
      <CardHeader>

        <CardTitle className="text-2xl font-bold">Support Page</CardTitle>

      </CardHeader>
      <CardContent className="flex flex-col gap-4">
      <Textarea
      placeholder="please enter your problem"/>
      <Button className="w-fit">Submit</Button>
      </CardContent>


    </Card>
  );
}