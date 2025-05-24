"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowUpRight, Bell, Calendar, Clock, Tag, User, MessageSquare, ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion,AccordionItem } from "@/components/accordion"
import { getStatusBadge, getPriorityBadge } from "@/pages/global-components/GetStatusColor"
import { TicketStatus, TicketPriority } from "@/types"
import { Link } from "react-router-dom"



interface TicketProps {
  ticket: {
    _id: string
    escalation_date?: string
    esclated_user?: string
    ticket_number: number
    title: string
    description?: string
    escalation_reason?: string
    status: TicketStatus
    priority: TicketPriority
    category: string
    createdAt: string
    assigned_to: string
    escalation: Array<{
      _id: string
      assigned_to: string
      level_of_user: string
      escalation_time: string
      escalation_reason?: string
    }>
    sla?: Array<any>
    IsCumstomerCommneted?: boolean
  }
}

export default function TimelineEscalationCard({ ticket}: Partial<TicketProps>) {
  const statusBadge = getStatusBadge(ticket?.status || TicketStatus.Open)
  const priorityBadge = getPriorityBadge(ticket?.priority || TicketPriority.Medium)
  console.log("Ticket Data:", ticket)



  // Early return if no ticket data
  if (!ticket) {
    return null
  }

  // Ensure escalation is always an array
  const escalation = ticket.escalation || []

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "L1":
        return "bg-gray-400 text-white"
      case "L2":
        return "bg-amber-500 text-white"
      case "L3":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  return (
    <Link to={`/agent/escalated-tickets/detail/${ticket._id}`}  className="block w-full">
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md",
        `border-l-4 ${statusBadge.border}`,
      )}
    >
      <CardHeader className="p-4 pb-0 relative">
        {ticket.IsCumstomerCommneted && (
          <Badge className="absolute right-4 top-4 bg-red-600 hover:bg-red-700 rounded-full p-1">
            <Bell className="h-3 w-3" />
          </Badge>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-gray-100 rounded-sm text-xs">
            #{ticket.ticket_number}
          </Badge>
          <Badge className={cn("text-xs flex items-center gap-1", statusBadge.color)}>
            {statusBadge.icon}
            {ticket.status}
          </Badge>
          <Badge className={cn("text-xs flex items-center gap-1", priorityBadge.color)}>
            {priorityBadge.icon}
            {ticket.priority}
          </Badge>
        </div>

        <h3 className="font-medium text-gray-900 hover:text-primary transition-colors cursor-pointer">
          {ticket.title}
        </h3>

        {ticket.description && <p className="text-gray-600 text-sm mt-1">{ticket.description}</p>}
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{ticket.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{(ticket.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{ticket.assigned_to}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">{ticket.escalation_reason}</div>

        {/* SLA Timer */}
        {ticket.sla && ticket.sla.length > 0 && (
          <div className="mt-3 flex items-center">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Clock className="w-3 h-3 mr-1" />
              SLA: {ticket.sla[0].remaining_time}
            </Badge>
          </div>
        )}


      </CardContent>
    </Card>
    </Link>
  )
}
