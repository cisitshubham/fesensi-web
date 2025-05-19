"use client"

import { getContactSupport, Updatesupport } from "@/api/admin"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Check, Clock, Loader2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface SupportRequest {
  _id: string
  created_by: string
  contact_number: string
  calling_time?: string
  message: string
  createdAt: string
  is_resolved: boolean
}

export default function AdminSupportList() {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState<{ open: boolean; request: SupportRequest | null }>({
    open: false,
    request: null,
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await getContactSupport()
      setRequests(res.data || [])
    } catch (e) {
      /* error handled silently */
    }
    setLoading(false)
  }

  async function handleResolve(request: SupportRequest) {
    setDialog({ open: true, request })
  }

  async function confirmResolve() {
    if (!dialog.request) return
    setUpdating(true)
    try {
      await Updatesupport(dialog.request._id)
      setRequests((prev) =>
        prev.map((r) => (r._id === dialog.request!._id ? { ...r, is_resolved: !r.is_resolved } : r)),
      )
      setDialog({ open: false, request: null })
    } catch (e) {
      /* error handled silently */
    }
    setUpdating(false)
  }

  function formatDate(date: string) {
    try {
      return format(new Date(date), "MMM d, yyyy 'at' h:mm a")
    } catch {
      return date
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Support Requests</h2>
        <Badge variant="outline">{requests.filter((r) => !r.is_resolved).length} Open</Badge>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created By</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Calling Time</TableHead>
              <TableHead className="hidden md:table-cell">Message</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No support requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.created_by}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {item.contact_number}
                    </div>
                  </TableCell>
                  <TableCell>{item.calling_time || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">{item.message}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_resolved ? "default" : "destructive"}>
                      {item.is_resolved ? <Check className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                      {item.is_resolved ? "Resolved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={item.is_resolved ? "outline" : "default"}
                      disabled={updating || item.is_resolved}
                      size="sm"
                      onClick={() => handleResolve(item)}
                    >
                      Resolve
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialog.open} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            Are you sure you want to mark this support request as{" "}
            {dialog.request?.is_resolved ? "unresolved" : "resolved"}?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false, request: null })}>
              Cancel
            </Button>
            <Button onClick={confirmResolve} disabled={updating}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
