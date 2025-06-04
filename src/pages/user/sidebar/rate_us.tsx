import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Clock, CheckCircle2, Star } from "lucide-react"
import { GetSkippedFeedback } from "@/api/user"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { getPriorityBadge, getStatusBadge } from "@/pages/global-components/GetStatusColor"
import { RateUsSkeleton } from "@/components/skeletons"

export default function RateUsUser() {
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchFeedback = async () => {
    try {
      const response = await GetSkippedFeedback()
      if (response.success) {
        setLoading(false)
        setError(null)
        setFeedback(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch feedback")
      }
    } catch (error: any) {
      setError("Failed to fetch feedback. Please try again later.")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Feedback</h1>
          <p className="text-muted-foreground mt-1">
            Rate our service for the following support tickets
          </p>
        </div>
        {feedback.length > 0 && (
          <Badge variant="outline" className="px-3 py-1">
            {feedback.length}{" "}
            {feedback.length === 1 ? "ticket" : "tickets"} pending
          </Badge>
        )}
      </div>

      <Dialog open={!!error}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <DialogDescription>{error}</DialogDescription>
        </DialogContent>
      </Dialog>

      {loading ? (
        <RateUsSkeleton />
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : feedback.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">All caught up!</h3>
            <p className="text-muted-foreground max-w-md">
              You don't have any pending tickets that need feedback. Thank you for
              your contributions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {feedback.map((item) => (
            <Card
              key={item._id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xs text-muted-foreground font-medium">
                    Ticket #{item.ticket_number}
                  </CardTitle>
                  <div className="flex flex-row gap-2">
                  <Badge className={`${getPriorityBadge(item.priority).color}`}>
                    {item.priority}
                  </Badge>
                  <Badge className={`${getStatusBadge(item.status).color}`}>
                    {item.status}
                  </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex flex-row justify-between">
                <div className="">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Assigned to:</span> {item.assigned_to}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Created{" "}
                      {new Date(item.createdAt).toLocaleDateString()} at{" "}
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/10 pt-3">
                <Button
                  onClick={() => navigate(`/user/feedback/${item._id}`)}
                  className="w-full gap-2"
                >
                  <Star className="h-4 w-4" />
                  Rate our service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
