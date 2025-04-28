"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import type { Tickettype } from "@/types"
import { Bell, Calendar, Clock, ArrowRight } from "lucide-react"
import { GetUserTicketDetails } from "@/api/api"
import { getStatusBadge } from "@/pages/global-components/GetStatusColor"

interface TicketProps {
  ticket: Tickettype
}

export default function UserTicket({ ticket }: TicketProps) {
  // Function to determine the status badge styling


  // Function to get priority indicator

  const statusBadge = getStatusBadge(ticket.status)

  return (
    <Link to={`/user/ticket/${ticket._id}`} className="block w-full">
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group">
        {/* Priority indicator */}
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-sm bg-gray-50">
                  #{ticket.ticket_number}
                </Badge>
                <Badge className={`${statusBadge.color} flex items-center`}>
                  {statusBadge.icon}
                  {ticket.status}
                </Badge>
            		{ticket.isAgentCommented === true && (
		<Badge className="absolute right-0  bg-red-700/80 rounded-full p-1">
		<Bell className="" />
		</Badge>
		)}
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{ticket.title}</h3>
              <p className="text-gray-600 line-clamp-2 text-sm">{ticket.description}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-5 py-3 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>Due: {ticket.due_date}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
