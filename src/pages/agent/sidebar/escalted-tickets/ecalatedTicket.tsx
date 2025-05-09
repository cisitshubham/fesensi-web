"use client"

import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { TicketStatus, type TicketPriority } from "@/types"
import { Bell, Calendar, Clock, Tag, User, ChevronDown, ChevronUp } from "lucide-react"
import { getPriorityBadge, getStatusBadge } from "@/pages/global-components/GetStatusColor"
import clsx from "clsx"
import Timer from "@/pages/global-components/timer"
import { useState } from "react"

interface TicketProps {
  ticket: {
    _id: string
    ticket_number: number
    title: string
    description?: string
    status: string
    priority: string
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

export default function TicketItem({ ticket }: TicketProps) {
  const statusBadge = getStatusBadge(ticket.status as TicketStatus)
  const priorityBadge = getPriorityBadge(ticket.priority as TicketPriority)
  const [remainingHours, setRemainingHours] = useState(0)
  const [remainingMinutes, setRemainingMinutes] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={clsx(
        "border-l-4 border-b border-r border-t bg-white hover:bg-gray-50 transition-all",
        priorityBadge.border,
        "relative group",
      )}
    >
      {ticket.IsCumstomerCommneted === true && (
        <Badge className="absolute right-2 top-2 bg-red-700/80 rounded-full p-1">
          <Bell className="h-3 w-3" />
        </Badge>
      )}

      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* Left section - Ticket ID, Status, Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="outline" className="bg-gray-100 rounded-sm text-xs">
                #{ticket.ticket_number}
              </Badge>
              <Badge className={`${statusBadge.color} text-xs flex items-center gap-1`}>
                {statusBadge.icon}
                {ticket.status}
              </Badge>
              <Badge className={`${priorityBadge.color} text-xs flex items-center gap-1`}>
                {priorityBadge.icon}
                {ticket.priority}
              </Badge>
            </div>

            <Link
              to={{
                pathname: `/agent/ticket/${ticket._id}`,
              }}
              state={{ ticket }}
              className="block"
            >
              <h3 className="font-medium text-gray-900 truncate hover:text-primary transition-colors">
                {ticket.title}
              </h3>
            </Link>

            {ticket.description && <p className="text-gray-600 text-sm line-clamp-1 mt-1">{ticket.description}</p>}
          </div>

          {/* Right section - Meta information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mt-2 sm:mt-0">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>{ticket.category}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{ticket.assigned_to}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Escalations: {ticket.escalation.length}</span>
            </div>

            {ticket.status === TicketStatus.InProgress && (
              <Timer hours={remainingHours} minutes={remainingMinutes} seconds={remainingSeconds} />
            )}
          </div>
        </div>

        {/* Expandable section for escalation history */}
        <div className="mt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-xs font-medium text-gray-500 hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Hide Escalation History
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show Escalation History
              </>
            )}
          </button>

          {isExpanded && (
            <div className="mt-2 pl-2 border-l-2 border-gray-200 space-y-2">
              {ticket.escalation.map((esc, index) => (
                <div key={esc._id} className="text-xs text-gray-600">
                  <div className="font-medium">
                    #{index + 1} {esc.assigned_to} ({esc.level_of_user})
                  </div>
                  <div className="mt-1 pl-3 space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{esc.escalation_time}</span>
                    </div>
                    {esc.escalation_reason && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{esc.escalation_reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
