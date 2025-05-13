"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowUpRight, Bell, Calendar, Clock, Tag, User, MessageSquare, ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion,AccordionItem } from "@/components/accordion"
import { getStatusBadge, getPriorityBadge } from "@/pages/global-components/GetStatusColor"
import { TicketStatus, TicketPriority } from "@/types"



interface TicketProps {
  ticket: {
    _id: string
    ticket_number: number
    title: string
    description?: string
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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid Date"
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

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
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{ticket.assigned_to}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Escalations: {escalation.length}</span>
          </div>
        </div>

        {/* SLA Timer */}
        {ticket.sla && ticket.sla.length > 0 && (
          <div className="mt-3 flex items-center">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Clock className="w-3 h-3 mr-1" />
              SLA: {ticket.sla[0].remaining_time}
            </Badge>
          </div>
        )}

        {/* Escalation Timeline with Accordion */}
        <div className="mt-4">
          <Accordion   className="w-full">
            <AccordionItem title="Escalation Timeline" >
            
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-center min-w-max">
                    {/* Initial assignment */}
                    <div className="flex flex-col items-center w-40">
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                        L1
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium text-gray-700">Initial Assignment</div>
                        <div className="mt-1 text-xs text-gray-500">
                          <div className="flex items-center justify-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{ticket.assigned_to}</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Escalation steps */}
                    {escalation.map((esc, index) => (
                      <div key={esc._id} className="flex items-center">
                        {/* Arrow */}
                        <div className="flex items-center px-2">
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Escalation content */}
                        <div className="flex flex-col items-center w-40">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                              getLevelColor(esc.level_of_user),
                            )}
                          >
                            {esc.level_of_user}
                          </div>
                          <div className="mt-2 text-center">
                            <div className="text-xs font-medium text-gray-700">{esc.assigned_to}</div>
                            <div className="mt-1 text-xs text-gray-500">
                              <div className="flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(esc.escalation_time)}</span>
                              </div>
                              {esc.escalation_reason && (
                                <div className="mt-1 px-2 py-1 bg-gray-50 rounded-md border border-gray-100 max-w-[160px]">
                                  <div className="flex items-start gap-1">
                                    <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs line-clamp-2 text-left">{esc.escalation_reason}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Current status */}
                    <div className="flex items-center">
                      {/* Arrow */}
                      <div className="flex items-center px-2">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>

                      {/* Current status content */}
                      <div className="flex flex-col items-center w-40">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-xs font-medium text-gray-700">Current Status</div>
                          <div className="mt-1">
                            <Badge className={cn("text-xs", statusBadge.color)}>
                              {statusBadge.icon}
                              <span className="ml-1">{ticket.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
