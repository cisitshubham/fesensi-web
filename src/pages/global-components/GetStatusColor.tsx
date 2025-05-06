import { TicketStatus } from "@/types";
import { TicketPriority } from "@/types";
import { Clock } from "lucide-react";

export function GetStatusColor(status: TicketStatus) {
  const statusColors: Record<TicketStatus, string> = {
    [TicketStatus.Open]: "blue-500",
    [TicketStatus.InProgress]: "purple-500",
    [TicketStatus.Closed]: "yellow-500",
    [TicketStatus.Resolved]: "green-500",
  };

  return statusColors[status] || "gray-500";
}

export function getPriorityColor(priority: TicketPriority) {
  const priorityColors: Record<TicketPriority, string> = {
    [TicketPriority.Medium]: "amber-500",
    [TicketPriority.Low]: "blue-500",
    [TicketPriority.High]: "orange-500",
    [TicketPriority.Critical]: "red-500",
  };

  return priorityColors[priority] || "gray-500";
}

export function getStatusBadge(status: string) {
  switch (status) {
    case TicketStatus.Open:
      return {
        color: "bg-blue-100 text-blue-600 border-blue-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
        hex: "#60A5FA" // blue-400
      };
    case TicketStatus.InProgress:
      return {
        color: "bg-purple-100 text-purple-600 border-purple-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
        hex: "#C084FC" // purple-400
      };
    case TicketStatus.Closed:
      return {
        color: "bg-red-100 text-red-600 border-red-200",
        icon: null,
        hex: "#F87171" // red-400
      };
    case TicketStatus.Resolved:
      return {
        color: "bg-green-100 text-green-600 border-green-200",
        icon: null,
        hex: "#4ADE80" // green-400
      };
    default:
      return {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: null,
        hex: "#9CA3AF" // gray-400
      };
  }
}

export function getPriorityBadge(priority: TicketPriority) {
  switch (priority) {
    case TicketPriority.Low:
      return {
        border: "border-blue-200",
        color: "bg-blue-100 text-blue-600 border-blue-200",
        hex: "#60A5FA", // blue-400
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    case TicketPriority.Medium:
      return {
        border: "border-amber-200",
        color: "bg-amber-100 text-amber-600 border-amber-200",
        hex: "#FBBF24", // amber-400
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    case TicketPriority.High:
      return {
        border: "border-orange-200",
        color: "bg-orange-100 text-orange-600 border-orange-200",
        hex: "#FB923C", // orange-400
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    case TicketPriority.Critical:
      return {
        border: "border-red-200",
        color: "bg-red-100 text-red-600 border-red-200",
        hex: "#F87171", // red-400
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    default:
      return {
        border: "border-gray-200",
        color: "bg-gray-100 text-gray-600 border-gray-200",
        hex: "#9CA3AF", // gray-400
        icon: null,
      };
  }
}
