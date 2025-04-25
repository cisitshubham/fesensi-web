import { TicketStatus } from "@/types";
import { TicketPriority } from "@/types";
import { Clock } from "lucide-react";

export  function GetStatusColor(status: TicketStatus ) {
    console.log(status, "status")
    const statusColors: Record<TicketStatus, string> = {
        [TicketStatus.Open]: "blue-500",
        [TicketStatus.InProgress]:  "purple-500",
        [TicketStatus.Closed]: "yellow-500",
        [TicketStatus.Resolved]: "green-500",
    };

    return statusColors[status] || "gray-500"; 
}


export function getPriorityColor(priority: TicketPriority) {
    console.log(priority, "priority")
    const priorityColors: Record<TicketPriority, string> = {
        [TicketPriority.Low]: "blue-500",
        [TicketPriority.Medium]: "yellow-500",
        [TicketPriority.High]: "orange-500",
        [TicketPriority.Critical]: "red-500",
    };

    return priorityColors[priority] || "gray-500"; 
}


export function getStatusBadge (status: string)  {
    switch (status) {
      case TicketStatus.Open:
        return {
          color: "bg-blue-100 text-blue-600 border-blue-200",
          icon: <Clock className="w-3 h-3 mr-1" />,
        }
      case TicketStatus.InProgress:
        return {
          color: "bg-purple-100 text-purple-600 border-purple-200",
          icon: <Clock className="w-3 h-3 mr-1" />,
        }
      case TicketStatus.Closed:
        return {
          color: "bg-red-100 text-red-600 border-red-200",
          icon: null,
        }
      case TicketStatus.Resolved:
        return {
          color: "bg-green-100 text-green-600 border-green-200",
          icon: null,
        }
      default:
        return {
          color: "bg-gray-100 text-gray-600 border-gray-200",
          icon: null,
        }
    }
  }