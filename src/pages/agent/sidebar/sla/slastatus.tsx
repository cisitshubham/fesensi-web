"use client"

import { getSLA } from "@/api/agent"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SLAStatustype } from "@/types"
import { getPriorityBadge } from "@/pages/global-components/GetStatusColor"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, AlertTriangle, Calendar, Timer, TrendingUp, Activity } from "lucide-react"
import clsx from "clsx"

export default function SlastatusAgent() {
  const [slaData, setSlaData] = useState<SLAStatustype[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSLA = async () => {
    try {
      setLoading(true)
      const response = await getSLA()
      setSlaData(response.data)
    } catch (error) {
      console.error("Error fetching SLA data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSLA()
  }, [])

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "critical":
        return <AlertTriangle className="h-5 w-5" />
      case "medium":
        return <TrendingUp className="h-5 w-5" />
      case "low":
        return <Activity className="h-5 w-5" />
      default:
        return <Timer className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className=" mx-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Timer className="h-6 w-6 text-blue-600" />
            </div>

            <CardHeader>
              <CardTitle>

            <h1 className="text-xl font-bold text-slate-900">SLA Escalation Times</h1>
          <p className="text-slate-600">Service level agreement escalation times based on priority levels</p>
              </CardTitle>

            </CardHeader>
          </div>
        </div>

        {/* SLA Cards */}
        <CardContent>
          {Array.isArray(slaData) && slaData.length > 0 ? (
            <div className="flex flex-col gap-3">
              {slaData.map((sla, idx) => (
                <Card
                  key={idx}
                  className={clsx(
                    "overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg",
                    getPriorityBadge(sla.priority).border
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={clsx(
                            "p-2 rounded-lg",
                            sla.priority?.toLowerCase() === "high" || sla.priority?.toLowerCase() === "critical"
                              ? "bg-red-100 text-red-600"
                              : sla.priority?.toLowerCase() === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          )}
                        >
                          {getPriorityIcon(sla.priority)}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Priority</h3>
                      </div>
                      <Badge className={clsx("px-2 py-1 text-sm font-medium", getPriorityBadge(sla.priority).color)}>
                        {sla.priority}
                      </Badge>
                    </div>

                    <div className="flex flex-row w-full justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">Escalation Time</p>
                          <p className="text-lg font-bold text-slate-900">{sla.response_time} hours</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">Created At</p>
                          <p className="text-base font-semibold text-slate-900">{formatDate(sla.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-10">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-slate-100 rounded-full">
                    <Timer className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No SLA Data Found</h3>
                    <p className="text-sm text-slate-600">No escalation time data available at the moment.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
