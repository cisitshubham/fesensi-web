"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import type { Tickettype } from "@/types"
import { Bell, Calendar, Clock, ArrowRight } from "lucide-react"
import { GetUserTicketDetails } from "@/api/api"

interface TicketProps {
  ticket: Tickettype
}

export default function UserTicket({ ticket }: TicketProps) {
  // Function to determine the status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return {
          color: "bg-blue-100 text-blue-600 border-blue-200",
          icon: <Clock className="w-3 h-3 mr-1" />,
        }
      case "IN-PROGRESS":
        return {
          color: "bg-purple-100 text-purple-600 border-purple-200",
          icon: <Clock className="w-3 h-3 mr-1" />,
        }
      case "CLOSED":
        return {
          color: "bg-red-100 text-red-600 border-red-200",
          icon: null,
        }
      case "RESOLVED":
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
                {ticket?.isAgentCommented && (
                  <Badge className="bg-red-100 text-red-600 border-red-200">
                    <Bell className="w-3 h-3 mr-1" /> New Reply
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
