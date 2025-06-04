"use client"

import { User, Clock, AlertTriangle, ArrowRight, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEscalatedTicketsById } from "@/api/agent"
import { useState,useEffect } from "react"
import { useParams } from "react-router"
import { EscalatedTicketData } from "@/types"; // Updated import
import { getPriorityBadge, getPriorityColor, getStatusBadge } from "@/pages/global-components/GetStatusColor"


export default function EscalatedTicketDetail() {
    const { id } = useParams();

    const [ticketData, setTicketData] = useState<EscalatedTicketData>(); // Updated type

    useEffect(() => {
        const fetchTicketData = async () => {
            if (typeof id === "string") {
                try {
                    const response = await getEscalatedTicketsById(id);
                    setTicketData(response.data);
                } catch (error) {
                    console.error("Error fetching ticket data:", error);
                }
            }
        };

        fetchTicketData();
    }, [id]);

  

    return (
        <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Ticket Header */}
            <Card className="scale-[0.98] sm:scale-100">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl mb-2">
                                Ticket #{ticketData?.ticket_number}: {ticketData?.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {ticketData?.created_by}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {ticketData?.createdAt}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Tag className="h-4 w-4" />
                                    {ticketData?.category}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Badge variant="outline" className={`${getPriorityBadge(ticketData?.priority || '').color} text-sm`}>
                                {ticketData?.priority}
                            </Badge>
                            <Badge variant="outline" className={`${getStatusBadge(ticketData?.status || '').color} text-sm`}>
                                {ticketData?.status}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Escalation Cards */}
            <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Escalation History
                </h3>

                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
                    {ticketData?.escalation.map((escalation, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full `}></div>

                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div
                                            className={`w-8 h-8 rounded-full  flex items-center justify-center text-white text-sm font-bold`}
                                        >
                                            {escalation.level_of_user.replace("Level ", "")}
                                        </div>
                                        {escalation.level_of_user}
                                    </CardTitle>
                                    <Badge  className="text-xs">
                                        {escalation.escalation_time}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Assigned to:</span>
                                    <span>{escalation.assigned_to}</span>
                                </div>

                                {escalation.escalation_reason && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                                        <p className="text-sm text-gray-600">{escalation.escalation_reason}</p>
                                    </div>
                                )}

                                {!escalation.escalation_reason && (
                                    <p className="text-sm text-gray-500 italic">No specific reason provided</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Activity Summary */}
            <Card className="scale-[0.98] sm:scale-100">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {ticketData?.activity_log.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2rounded-full"></div>
                                    <span className="font-medium">{activity.action}</span>
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                    <span className="text-gray-600">{activity.creator}</span>
                                </div>
                                <span className="text-sm text-gray-500">{activity.createdAt}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
