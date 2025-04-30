"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import type { Tickettype } from "@/types"
import { Bell, Calendar, Clock, ArrowRight, Tag, User, MessageSquare } from "lucide-react"
import { getStatusBadge,getPriorityColor } from "@/pages/global-components/GetStatusColor"

interface TicketProps {
  ticket: Tickettype
}

export default function UserTicket({ ticket }: TicketProps) {
  const statusBadge = getStatusBadge(ticket.status)


  // Assuming ticket has these properties (add them to your type if needed)
  const priority = ticket.priority || "Medium"
  const category = ticket.category || "Support"
  const createdAt = ticket.createdAt || new Date().toISOString()
  const assignedTo = ticket.assigned_to || "Unassigned"

  // Get priority color


  return (
    <Link to={`/user/ticket/${ticket._id}`} className="block w-full">
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group relative">
        {ticket.isAgentCommented && (
          <Badge className="absolute right-0 top-0 bg-red-700/80 rounded-full p-1">
            <Bell className="h-4 w-4" />
          </Badge>
        )}

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left side content */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="rounded-sm bg-gray-50">
                  #{ticket.ticket_number}
                </Badge>
                <Badge className={`${statusBadge.color} flex items-center gap-1`}>
                  {statusBadge.icon}
                  {ticket.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{ticket.title}</h3>
              <p className="text-gray-600 line-clamp-2 text-sm">{ticket.description}</p>
            </div>

            {/* Right side content - New section */}
            <div className="flex flex-col gap-2 items-end min-w-[120px]">
           <Badge className={`bg-${getPriorityColor(ticket.priority)}`}>{ticket.priority}</Badge>

              <div className="flex flex-col items-end gap-1 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{category}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>created at: {(createdAt)}</span>
                </div>

           
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 py-3 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>Due: {ticket.due_date}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1.5" />
            <span>{assignedTo}</span>
            <ArrowRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-primary transition-colors" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
