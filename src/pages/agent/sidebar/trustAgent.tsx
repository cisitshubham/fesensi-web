+"use client"

import { getTrustlevel } from "@/api/agent"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Award, CheckCircle, Star, ThumbsUp, XCircle } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import ReactSpeedometer from "react-d3-speedometer"
import { Container } from "@/components"
// Custom progress bar component
const CustomProgress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div
      className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
)

interface TrustLevelData {
  level: string
  levelInfo: string
  maxNumber: number
  metrics: {
    totalTickets: number
    totalRatings: number
    avgRating: number
    slaCompliantCount: number
    notResolvedCount: number
  }
  recencyFactor: number
  score: number
  scoreOutOf100: number
}

export default function TrustPageAgent() {
  const [trustLevel, setTrustLevel] = useState<TrustLevelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrustLevel = async () => {
    try {
      const response = await getTrustlevel()
      if (response.success) {
        setLoading(false)
        setError(null)
        setTrustLevel(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch trust level")
      }
    } catch (error: any) {
      setError("Failed to fetch trust level. Please try again later.")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrustLevel()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-gray-200 rounded"></div>
          <div className="h-64 w-full max-w-3xl bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !trustLevel) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Determine badge color based on trust level
  const getBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "low":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    }
  }

  return (
    <Fragment >
      <Container className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader className="">
          </CardHeader>
          <CardContent>
                   <ReactSpeedometer
                value={trustLevel.scoreOutOf100}
                currentValueText={(trustLevel.scoreOutOf100 || 0).toFixed(0) }
                needleHeightRatio={0.7}
                minValue={0}
                maxValue={trustLevel.maxNumber}
                needleColor="black"
                ringWidth={10}
                />
               <div className="mx-auto content-center text-center">
              <Badge className={`text-lg  px-4 ${getBadgeColor(trustLevel.level || 'low')}`}>
                <Award className="mr-1 h-4 w-4" />
                {trustLevel.level || 'Not Rated'} 
              </Badge>
              <div className="">{trustLevel.levelInfo}</div>
              </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Performance Metrics</CardTitle>
            <CardDescription>Key indicators affecting trust score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">                  <span className="text-sm font-medium">Average Rating</span>
                  <span className="text-sm font-medium">{(trustLevel.metrics?.avgRating || 0).toFixed(1)}/5</span>
                </div>
                <div className="flex items-center">
                  <CustomProgress value={((trustLevel.metrics?.avgRating || 0) / 5) * 100} />
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(trustLevel.metrics?.avgRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>


              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Resolution Rate</span>
                  <span className="text-sm font-medium">                    {Math.round(
                      ((trustLevel.metrics?.totalTickets || 0) - (trustLevel.metrics?.notResolvedCount || 0)) /
                        (trustLevel.metrics?.totalTickets || 1) * 100
                    )}
                    %
                  </span>
                </div>
                <CustomProgress
                  value={
                    ((trustLevel.metrics?.totalTickets || 0) - (trustLevel.metrics?.notResolvedCount || 0)) /
                    (trustLevel.metrics?.totalTickets || 1) * 100
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">                  <span className="text-sm font-medium">Recency Factor</span>
                  <span className="text-sm font-medium">{((trustLevel.recencyFactor || 0) * 100).toFixed(0)}%</span>
                </div>
                <CustomProgress value={(trustLevel.recencyFactor || 0) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Detailed Statistics</CardTitle>
          <CardDescription>Comprehensive view of agent performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-gray-500 mb-1 flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>Total Tickets</span>
              </div>              <div className="text-2xl font-bold">{trustLevel.metrics?.totalTickets || 0}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-gray-500 mb-1 flex items-center">
                <Star className="mr-1 h-4 w-4" />
                <span>Total Ratings</span>
              </div>
              <div className="text-2xl font-bold">{trustLevel.metrics?.totalRatings || 0}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-gray-500 mb-1 flex items-center">
                <CheckCircle className="mr-1 h-4 w-4" />
                <span>SLA Compliant</span>
              </div>
              <div className="text-2xl font-bold">{trustLevel.metrics?.slaCompliantCount || 0}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-gray-500 mb-1 flex items-center">
                <XCircle className="mr-1 h-4 w-4" />
                <span>Not Resolved</span>
              </div>
              <div className="text-2xl font-bold">{trustLevel.metrics?.notResolvedCount || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Fragment>
  )
}
