import { TicketStatus } from "@/types";
import { TicketPriority } from "@/types";
import { Clock } from "lucide-react";

export function GetStatusColor(status: TicketStatus) {
  const statusColors: Record<TicketStatus, string> = {
    [TicketStatus.Open]: "blue-500",
    [TicketStatus.InProgress]: "purple-500",
    [TicketStatus.Resolved]: "yellow-500",
    [TicketStatus.Closed]: "green-500",
  };

  return statusColors[status] || "gray-500";
}

export function getPriorityColor(priority: TicketPriority) {
  const priorityColors: Record<TicketPriority, string> = {
    [TicketPriority.Low]: "blue-500",
    [TicketPriority.Medium]: "amber-500",
    [TicketPriority.High]: "orange-500",
    [TicketPriority.Critical]: "red-500",
  };

  return priorityColors[priority] || "gray-500";
}

export function getStatusBadge(status: string) {
  switch (status) {
    case TicketStatus.Open:
      return {
        darkbg: "bg-blue-400",
        border: "border-blue-400",
        color: "bg-blue-100 text-blue-600 border-blue-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
        hex: "#60A5FA" // blue-500
      };
    case TicketStatus.InProgress:
      return {
        darkbg: "bg-purple-400",
        border: "border-purple-400",
        color: "bg-purple-100 text-purple-600 border-purple-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
        hex: "#C084FC" // purple-500
      };
    case TicketStatus.Closed:
      return {
        darkbg: "bg-green-400",
        border: "border-green-400",
        color: "bg-green-100 text-green-600 border-green-200",
        icon: null,
        hex: "#4ADE80" // green-500
      };
    case TicketStatus.Resolved:
      return {
        darkbg: "bg-amber-400",
        border: "border-yellow-400",
        color: "bg-yellow-100 text-yellow-600 border-yellow-200",
        icon: null,
        hex: "#FACC15" // yellow-500
      };
    default:
      return {
        darkbg: "bg-gray-500",
        border: "border-gray-200",
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: null,
        hex: "#6B7280" // gray-500
      };
  }
}

export function getPriorityBadge(priority: string) {
  switch (priority) {
    case TicketPriority.Low:
      return {
        border: "border-blue-400",
        color: "bg-blue-100 text-blue-600 border-blue-200",
        hex: "#93C5FD", // blue-500
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    case TicketPriority.Medium:
      return {
        border: "border-amber-400",
        color: "bg-amber-100 text-amber-600 border-amber-200",
        hex: "#FCD34D", // amber-500
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    case TicketPriority.High:
      return {
        border: "border-orange-400",
        color: "bg-orange-100 text-orange-600 border-orange-200",
        hex: "#FDBA74", // orange-500
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    case TicketPriority.Critical:
      return {
        border: "border-red-400",
        color: "bg-red-100 text-red-600 border-red-200",
        hex: "#FCA5A5", // red-500
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    default:
      return {
        border: "border-gray-400",
        color: "bg-gray-100 text-gray-600 border-gray-200",
        hex: "#6B7280", // gray-500
        icon: null,
      };
  }
}
