import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus, X, Check, Loader2, Search, Filter, ArrowUpDown } from "lucide-react"
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context"
import type { MasterDropdownDatatype } from "@/types"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createCategories } from "@/api/api"
import { useNavigate } from "react-router-dom"
export default function CategoryManagement() {
  const { dropdownData } = useMasterDropdown()
  const [categories, setCategories] = useState<MasterDropdownDatatype["categories"]>(dropdownData.categories || [])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editedCategory, setEditedCategory] = useState({ title: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newCategoryTitle, setNewCategoryTitle] = useState("")
  const navigate = useNavigate()  
  const filtered = categories.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleEdit = (index: number) => {
    setEditIndex(index)
    setEditedCategory({ title: categories[index].title })
  }

  const handleSave = async () => {
    if (!editedCategory.title.trim()) return toast.error("Category title cannot be empty")
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", editedCategory.title.trim())
      const response = await createCategories(formData)

      if (response.success && editIndex !== null) {
        const updated = [...categories]
        updated[editIndex].title = editedCategory.title.trim()
        setCategories(updated)
        setEditIndex(null)
        toast.success("Category saved successfully")
      }
    } catch {
      toast.error("Failed to save")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditIndex(null)
  }

  const handleAddCategorySubmit = async () => {
    if (!newCategoryTitle.trim()) return toast.error("Category title cannot be empty")
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", newCategoryTitle.trim())
      const response = await createCategories(formData)

      if (response.success) {
   
        toast.success("Category added successfully")
        setShowAddDialog(false)
        navigate('/admin/categories')
      }
    } catch {
      toast.error("Failed to add category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const sortByTitle = (order: "asc" | "desc") => {
    const sorted = [...categories].sort((a, b) =>
      order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    )
    setCategories(sorted)
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
              <CardTitle className="text-2xl font-bold">Categories</CardTitle>
              <CardDescription className="mt-1">Manage your product categories</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2" disabled={isSubmitting}>
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
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
              <h3 className="text-lg font-medium text-slate-700">No categories found</h3>
              <p className="text-slate-500 mt-1">{searchQuery ? "Try a different search term" : 'Click "Add Category" to create one'}</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[70%]">Title</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((cat, i) => {
                    const index = categories.findIndex(c => c._id === cat._id)
                    const isEditing = editIndex === index
                    return (
                      <TableRow key={cat._id} className="group hover:bg-slate-50">
                        <TableCell>
                          {isEditing ? (
                            <Input name="title" value={editedCategory.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedCategory({ title: e.target.value })}
                              autoFocus className="max-w-md" placeholder="Enter category title" />
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{cat.title || <span className="text-muted-foreground italic">Untitled</span>}</span>
                              {cat._id.startsWith("temp-") && (
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
            Showing {filtered.length} of {categories.length} categories
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Enter the title of the category to add it to the list.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Category title"
            value={newCategoryTitle}
            onChange={e => setNewCategoryTitle(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCategorySubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
