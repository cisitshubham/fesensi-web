import React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus, X, Check, Loader2, Search, Filter, ArrowUpDown } from "lucide-react"
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context"
import type { MasterDropdownDatatype } from "@/types"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateFeedbackOptions } from "@/api/api"
import { useNavigate } from "react-router-dom"
import { updateFeedbackOptions } from "@/api/admin"

export default function FeedbackOptions() {
  const { dropdownData, loading } = useMasterDropdown()
  const [feedbackOptions, setFeedbackOptions] = useState<MasterDropdownDatatype["feedbackOptions"]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editedOption, setEditedOption] = useState({ title: "", _id: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newOptionTitle, setNewOptionTitle] = useState("")
  const navigate = useNavigate()

  // Update feedbackOptions when dropdownData changes
  React.useEffect(() => {
    if (dropdownData?.feedbackOptions) {
      setFeedbackOptions(dropdownData.feedbackOptions)
    }
  }, [dropdownData])

  const filtered = feedbackOptions.filter((c: { title: string }) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleEdit = (index: number) => {
    setEditIndex(index)
    setEditedOption({ title: feedbackOptions[index].title, _id: feedbackOptions[index]._id })
  }

  const handleSave = async () => {
    if (!editedOption.title.trim()) return toast.error("Feedback option cannot be empty", {
      position: "top-center"
    })
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", editedOption.title.trim())
      const response = await updateFeedbackOptions(editedOption._id, formData)

      if (response.success && editIndex !== null) {
        const updatedOptions = [...feedbackOptions]
        updatedOptions[editIndex] = { ...updatedOptions[editIndex], title: editedOption.title }
        setFeedbackOptions(updatedOptions)
        setEditIndex(null)

        setEditedOption({ title: "", _id: "" })
        toast.success("Feedback option updated successfully", {
          position: "top-center"
        })
        navigate('/admin/feedback-options')

      }
    } catch {
      toast.error("Failed to update feedback option", {
        position: "top-center"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditIndex(null)
  }

  const handleAddOptionSubmit = async () => {
    if (!newOptionTitle.trim()) return toast.error("Feedback option cannot be empty", {
      position: "top-center"
    })
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", newOptionTitle.trim())
      const response = await CreateFeedbackOptions(formData)

      if (response.success) {
        toast.success("Feedback option added successfully", {
          position: "top-center"
        })
        setFeedbackOptions((prev) => [...prev, { title: newOptionTitle, _id: response.data._id }])
        setNewOptionTitle("")
        setShowAddDialog(false)
        navigate('/admin/feedback-options')
      }
    } catch {
      toast.error("Failed to add feedback option", {
        position: "top-center"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sortByTitle = (order: "asc" | "desc") => {
    const sorted = [...feedbackOptions].sort((a, b) =>
      order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    )
    setFeedbackOptions(sorted)
  }

  const ActionButtons = ({ index }: { index: number }) => {
    const isEditing = editIndex === index
    const canEdit = editIndex === null && !isSubmitting

    if (isEditing) {
      return (
        <>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </>
      )
    }

    return (
      <>
        <Button variant="outline" size="sm" onClick={() => handleEdit(index)} disabled={!canEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="shadow-md border-slate-200">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Feedback Options</CardTitle>
              <CardDescription className="mt-1">Manage your feedback options for surveys and forms</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2" disabled={isSubmitting}>
              <Plus className="h-4 w-4" /> Add Feedback Option
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback options..."
                className="pl-10"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> <span className="hidden sm:inline">Sort</span>
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => sortByTitle("asc")}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortByTitle("desc")}>Name (Z-A)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <Filter className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700">No feedback options found</h3>
              <p className="text-slate-500 mt-1">{searchQuery ? "Try a different search term" : 'Click "Add Feedback Option" to create one'}</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[70%]">Feedback Option</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((option: { title: string; _id: string }, i: number) => {
                    const index = feedbackOptions.findIndex((c: { _id: string }) => c._id === option._id)
                    const isEditing = editIndex === index
                    return (
                      <TableRow key={option._id} className="group hover:bg-slate-50">
                        <TableCell>
                          {isEditing ? (
                            <Input
                              name="title"
                              value={editedOption.title}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedOption({ title: e.target.value, _id: editedOption._id })}
                              autoFocus
                              className="max-w-md"
                              placeholder="Enter feedback option"
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{option.title || <span className="text-muted-foreground italic">Untitled</span>}</span>
                              {option._id.startsWith("temp-") && (
                                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">New</Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <ActionButtons index={index} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filtered.length} of {feedbackOptions.length} feedback options
          </div>
        </CardContent>
      </Card>

      {/* Add Feedback Option Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Add New Feedback Option</DialogTitle>
            <DialogDescription>Enter the feedback option to add it to the list.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Feedback option"
            value={newOptionTitle}
            onChange={e => setNewOptionTitle(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddOptionSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
