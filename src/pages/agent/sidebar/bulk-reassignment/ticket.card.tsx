import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { GetStatusColor, getPriorityBadge, getPriorityColor, getStatusBadge } from "@/pages/global-components/GetStatusColor";
import { Tickettype } from "@/types";

interface BulkReassignCardProps {
  ticket: Tickettype;
  onCheck: (id: string, isSelected: boolean) => void;
}

export default function BulkReassignCard({ ticket, onCheck }: BulkReassignCardProps) {
  const [isChecked, setIsChecked] = useState(ticket.isSelected || false);

  useEffect(() => {
    setIsChecked(ticket.isSelected || false);
  }, [ticket.isSelected]);

const status = getStatusBadge(ticket.status);
const priority = getPriorityBadge(ticket.priority);

  return (
    <Card className={`w-full max-w-md transition-shadow duration-200 ${isChecked ? 'shadow-lg' : 'shadow-sm'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-1">
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => {
                setIsChecked(checked === true);
                onCheck(ticket._id, checked === true);
              }}
              className="h-5 w-5"
              id={`ticket-${ticket.ticket_number}`}
            />
          </div>

          {/* Ticket details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-700">Ticket Number</div>
                <span className="text-sm font-medium text-gray-600">{ticket.ticket_number}</span>
              </div>
              <div className="flex flex-col gap-2">
              <Badge variant="outline" className={`${status.color} text-xs`}>
                {ticket.status}
              </Badge>
              <Badge className={`${priority.color}`}>{ticket.priority}</Badge>
            </div>
            </div>

            {/* Title */}
            <h3 className="font-medium text-gray-900 line-clamp-2">{ticket.title}</h3>
            {/* Description */}
            {ticket.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
            )}

            {/* Category */}

            {/* Priority */}
            <div className="flex items-center gap-1">
              
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}