import type React from "react"
import { useState, useEffect } from "react"
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
import { useNavigate } from "react-router-dom"
import { CreatePriorities, updatePriorities } from "@/api/admin"

export default function PrioritiesManagement() {
  const { dropdownData } = useMasterDropdown()
  const [priorities, setpriorities] = useState<MasterDropdownDatatype["priorities"]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editedpriority, setEditedpriority] = useState({ title: "", esclationHrs: "", responseHrs: "", _id: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newpriorityTitle, setNewpriorityTitle] = useState("")
  const [newprioritySla, setNewprioritySla] = useState("")
  const [newpriorityResponseHrs, setNewpriorityResponseHrs] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (dropdownData?.priorities) {
      setpriorities(dropdownData.priorities)
      setIsLoading(false)
    }
  }, [dropdownData?.priorities])

  const filtered = priorities.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (index: number) => {
    setEditIndex(index)
    setEditedpriority({
      title: priorities[index].name,
      esclationHrs: priorities[index].esclationHrs?.toString() || "",
      responseHrs: priorities[index].responseHrs?.toString() || "",
      _id: priorities[index]._id,
    })
  }

  const handleSave = async () => {
    if (!editedpriority.title.trim()) return toast.error("Priority title cannot be empty", { position: "top-center" })
    if (isNaN(Number(editedpriority.esclationHrs))) return toast.error("Escalation hours must be a number", { position: "top-center" })
    if (isNaN(Number(editedpriority.responseHrs))) return toast.error("Response hours must be a number", { position: "top-center" })
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", editedpriority.title.trim())
      formData.append("esclationHrs", Number(editedpriority.esclationHrs).toString())
      formData.append("responseHrs", Number(editedpriority.responseHrs).toString())
      const response = await updatePriorities(editedpriority._id, formData)

      if (response.success && editIndex !== null) {
        const updated = [...priorities]
        updated[editIndex].name = editedpriority.title.trim()
        updated[editIndex].esclationHrs = parseInt(editedpriority.esclationHrs.trim(), 10)
        updated[editIndex].responseHrs = parseInt(editedpriority.responseHrs.trim(), 10)
        setpriorities(updated)
        setEditIndex(null)
        toast.success("Priority saved successfully", { position: "top-center" })
      }
    } catch {
      toast.error("Failed to save", { position: "top-center" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditIndex(null)
  }

  const handleAddprioritySubmit = async () => {
    if (!newpriorityTitle.trim()) return toast.error("priority title cannot be empty", { position: "top-center" })
    if (isNaN(Number(newprioritySla))) return toast.error("Escalation hours must be a number", { position: "top-center" })
    if (isNaN(Number(newpriorityResponseHrs))) return toast.error("Response hours must be a number", { position: "top-center" })
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", newpriorityTitle.trim())
      formData.append("esclationHrs", Number(newprioritySla).toString())
      formData.append("responseHrs", Number(newpriorityResponseHrs).toString())
      const response = await CreatePriorities(formData)

      if (response.success) {
        toast.success("Priority added successfully", { position: "top-center" })
        const newPriority = {
          _id: response.data._id,
          name: newpriorityTitle.trim(),
          esclationHrs: parseInt(newprioritySla.trim(), 10),
          responseHrs: parseInt(newpriorityResponseHrs.trim(), 10),
        }
        setpriorities(prev => [...prev, newPriority])
        setShowAddDialog(false)
        navigate('/admin/priorities')
      }
    } catch {
      toast.error("Failed to add priority", { position: "top-center" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sortByTitle = (order: "asc" | "desc") => {
    const sorted = [...priorities].sort((a, b) =>
      order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    )
    setpriorities(sorted)
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
              <CardTitle className="text-2xl font-bold">Priorities</CardTitle>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2" disabled={isSubmitting}>
              <Plus className="h-4 w-4" /> Add Priority
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search priorities..."
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

          {isLoading ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <Loader2 className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-spin" />
              <h3 className="text-lg font-medium text-slate-700">Loading priorities...</h3>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <Filter className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700">No priorities found</h3>
              <p className="text-slate-500 mt-1">
                {searchQuery 
                  ? "Try a different search term" 
                  : priorities.length === 0 
                    ? 'Click "Add priority" to create one' 
                    : 'No priorities match your search'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[30%]">Title</TableHead>
                    <TableHead className="w-[20%]">Escalation Hours</TableHead>
                    <TableHead className="w-[20%]">Response Hours</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((cat, i) => {
                    const index = priorities.findIndex(c => c._id === cat._id)
                    const isEditing = editIndex === index
                    return (
                      <TableRow key={cat._id} className="group hover:bg-slate-50">
                        <TableCell>
                          {isEditing ? (
                            <Input name="title" value={editedpriority.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedpriority({ ...editedpriority, title: e.target.value })}
                              autoFocus className="max-w-md" placeholder="Enter priority title" />
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{cat.name || <span className="text-muted-foreground italic">Untitled</span>}</span>
                              {cat._id.startsWith("temp-") && (
                                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">New</Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              name="esclationHrs"
                              value={editedpriority.esclationHrs}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditedpriority({ ...editedpriority, esclationHrs: e.target.value })
                              }
                              className="max-w-md"
                              placeholder="Enter escalation hours"
                            />
                          ) : (
                            <span>{cat.esclationHrs || "N/A"}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              name="responseHrs"
                              value={editedpriority.responseHrs}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditedpriority({ ...editedpriority, responseHrs: e.target.value })
                              }
                              className="max-w-md"
                              placeholder="Enter response hours"
                            />
                          ) : (
                            <span>{cat.responseHrs || "N/A"}</span>
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
            {!isLoading && `Showing ${filtered.length} of ${priorities.length} priorities`}
          </div>
        </CardContent>
      </Card>

      {/* Add priority Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Add New priority</DialogTitle>
            <DialogDescription>Enter the details of the priority to add it to the list.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="priority title"
              value={newpriorityTitle}
              onChange={e => setNewpriorityTitle(e.target.value)}
              autoFocus
            />
            <Input
              placeholder="escalation hours"
              onChange={e => setNewprioritySla(e.target.value)}
            />
            <Input
              placeholder="response hours"
              onChange={e => setNewpriorityResponseHrs(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddprioritySubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
