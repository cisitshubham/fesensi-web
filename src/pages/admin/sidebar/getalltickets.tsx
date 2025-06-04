"use client"

import { getAllTicketsAdmin } from "@/api/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Fragment, useEffect, useState } from "react"
import { getPriorityBadge,getStatusBadge } from "@/pages/global-components/GetStatusColor"

interface Ticket {
  _id: string
  title: string
  description: string
  createdAt: string
  status: string
  priority: string
  category: string
  ticket_number: number
  icon: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalTickets: number
  ticketsPerPage: number
}

export default function TicketsTableTemplate() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
    ticketsPerPage: 10,
  })

  const fetchTickets = async (page = 1, perPage = 10) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("page", page.toString())
      formData.append("ticketsPerPage", perPage.toString())
      if (searchTerm) formData.append("search", searchTerm)

      const response = await getAllTicketsAdmin(formData)
      if (response.success) {
        setTickets(response.data.result)
        setPagination({
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalTickets: response.data.totalCount || 0,
          ticketsPerPage: perPage,
        })
      } else {
        throw new Error(response.message || "Failed to fetch tickets")
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets(pagination.currentPage, pagination.ticketsPerPage)
  }, [])

  const handlePageChange = (newPage: number) => {
    fetchTickets(newPage, pagination.ticketsPerPage)
  }

  const handlePerPageChange = (newPerPage: string) => {
    const perPage = Number.parseInt(newPerPage)
    fetchTickets(1, perPage)
  }

  // Updated handleSearch to work dynamically with the input
  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchTickets(pagination.currentPage, pagination.ticketsPerPage);
    } else {
      const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTickets(filteredTickets);
    }
  }, [searchTerm]);

  return (
      <Card className="mx-8">
        <CardHeader className="flex flex-row justify-between w-full items-center">
          <CardTitle>All Tickets</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
          
            </div>
            <Select value={pagination.ticketsPerPage.toString()} onValueChange={handlePerPageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading tickets...</div>
          ) : tickets.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket._id}>
                 
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{ticket.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(ticket.priority).color}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(ticket.status).color}>{ticket.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {(ticket.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(pagination.currentPage - 1) * pagination.ticketsPerPage + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.ticketsPerPage, pagination.totalTickets)} of{" "}
                  {pagination.totalTickets} tickets
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No tickets available.</div>
          )}
        </CardContent>
      </Card>
  )
}
