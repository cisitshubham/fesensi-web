"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, Tag, AlertCircle, CheckCircle, XCircle, Send } from "lucide-react"

import { getTicketById, addcomment } from "@/api/api"
import type { Tickettype } from "@/types"
import { Alert } from "@/components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { CloseTicketUser } from "@/api/api"
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getStatusBadge, getPriorityColor } from "@/pages/global-components/GetStatusColor"
export default function UserResolveTicket() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<Tickettype | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [comment_text, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        const data = await getTicketById(id || "")
        setTicket(data.data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch ticket:", err)
        setError("Failed to load ticket. Please try again.")
        setTicket(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTicket()
    } else {
      setError("Invalid ticket ID")
      setLoading(false)
    }
  }, [id])

  const handleResolve = async () => {
    if (!ticket?._id) return

    try {
      await CloseTicketUser({ ticket_id: ticket._id })
      toast.success("Ticket resolved successfully.", { position: "top-center" })
      setShowDialog(true); // Open the dialog box
    } catch (err) {
      console.error("Failed to resolve ticket:", err)
      toast.error("Failed to resolve ticket. Please try again.", { position: "top-center" })
    }
  }

  const handleSubmitFeedback = async () => {
    if (!comment_text.trim() || !ticket?._id) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("comment_text", comment_text);
      formData.append("ticket", String(ticket._id));
      await addcomment(formData);

      toast.success("Query submitted successfully.", { position: "top-center" });
      setShowFeedback(false);

      setTimeout(() => {
        navigate("/user/MyTickets");
      }, 1000);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Failed to submit feedback. Please try again.", { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };


  const statusBadge = getStatusBadge(ticket?.status || "")
  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 shadow-md ">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert className="w-full max-w-4xl mx-auto mt-8" variant="danger">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span>{error}</span>
      </Alert>
    )
  }

  if (!ticket) {
    return null
  }

  return (
    <div className=" px-4 ">
      <Card className="">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-xl font-bold">{ticket.title}</p>
              <CardTitle className="  text-sm text-muted-foreground mt-1">Ticket #{ticket.ticket_number}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={`bg-${getPriorityColor(ticket.priority)}`}>{ticket.priority}</Badge>
              <Badge className={`${statusBadge.color} flex items-center gap-1`}>
                {statusBadge.icon}
                {ticket.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm">{ticket.createdAt}</span>
            </div>
            {ticket.category && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Category:</span>
                <span className="text-sm">{ticket.category}</span>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-semibold mb-2">Description</h3>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm whitespace-pre-wrap">{ticket.description || "No description provided."}</p>
            </div>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Attachments</h3>
              <div className="flex flex-wrap gap-4">
                {ticket.attachments.map((attachment, idx) => (
                  <div key={attachment._id || idx} className="relative group">
                    <img
                     onClick={() => setSelectedImage(attachment.file_url)}
                      src={attachment.file_url || "/placeholder.svg"}
                      alt={`attachment-${idx}`}
                      className="w-32 h-32 object-cover border rounded-md transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <img
                src={selectedImage}
                alt="Selected attachment"
                className="max-w-full max-h-full"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                &times;
              </button>
            </div>
          )}
        </CardContent>

        {ticket.latest_agent_comment?.comment_text && (
          <div className="mx-6 mb-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-bold flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Latest Agent Response
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {ticket.latest_agent_comment.creator_name} -{" "}
                  {(ticket.latest_agent_comment.createdAt)}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-4 bg-muted/50 rounded-md mt-2">
                  <p className="text-sm whitespace-pre-wrap">{ticket.latest_agent_comment.comment_text}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <CardFooter className="flex flex-col items-start pt-4 border-t">
          <div className="w-full">
            <h3 className="text-md font-semibold mb-4">Is your problem solved?</h3>
            <div className="flex gap-4 mb-4">
              <Button variant="default" className="flex items-center gap-2" onClick={handleResolve}>
                <CheckCircle className="h-4 w-4" />
                Yes, mark as resolved
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setShowFeedback(true)}
              >
                <XCircle className="h-4 w-4" />
                No, I need more help
              </Button>
            </div>

            {showFeedback && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
                <Textarea
                  placeholder="Please describe what's still not working or what additional help you need..."
                  className="min-h-[120px] w-full"
                  value={comment_text}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowFeedback(false)
                      setFeedback("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className="flex items-center gap-2"
                    onClick={handleSubmitFeedback}
                    disabled={!comment_text.trim() || submitting}
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Ticket Resolved</CardTitle>
              </CardHeader>
              <p>Your ticket has been successfully resolved. Thank you for your patience!</p>
              <p className="text-gray-500">Please rate your expierence</p>
              <CardFooter className="flex flex-row justify-between items-center mt-4">
                <Button onClick={() => navigate(`/user/feedback/${ticket._id}`)}>Rate our service</Button>
                <Button variant={"outline"} onClick={() => navigate(`/user/MyTickets/`)}>Go to My Tickets</Button>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      )
      }
    </div >
  )
}