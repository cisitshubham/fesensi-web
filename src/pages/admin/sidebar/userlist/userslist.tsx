"use client"

import type React from "react"

import { Makeandremoveadmin } from "@/api/admin"
import { useEffect, useState, useRef } from "react"
import { getAllUsers, updateUser } from "@/api/api"
import { MoreHorizontal, ArrowUpDown, SearchIcon, X } from "lucide-react"
import { deactiveateUser } from "@/api/admin"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { KeenIcon } from "@/components"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Types
interface Category {
  _id: string
  title: string
}
interface Role {
  _id: string
  role_name: string
  permissions: string[]
  status: string
  createdAt: string
}
interface Level {
  _id: string
  name: string
}

interface ExtendedUser {
  _id: string
  email: string
  first_name: string
  level: string | Level
  categories: Category[]
  status: boolean
  profile_img: string
  role: Role | Role[]
  createdAt?: string
  updatedAt?: string
}

// Helpers
const formatRole = (role: ExtendedUser["role"]) =>
  Array.isArray(role)
    ? role.map((r) => ("role_name" in r ? r.role_name : r)).join(", ")
    : typeof role === "object" && "role_name" in role
      ? role.role_name
      : String(role || "N/A")

const formatLevel = (level: ExtendedUser["level"]) =>
  typeof level === "object" && "level_name" in level ? level.level_name : String(level || "N/A")

// Components
function Search({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (q: string) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative w-full sm:w-64 md:w-80">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-8"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  )
}

function UserTable({
  users,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDeactivate,
  onMakeAdmin,
}: {
  users: ExtendedUser[]
  sortColumn: string | null
  sortDirection: "asc" | "desc"
  onSort: (column: string) => void
  onEdit: (user: ExtendedUser) => void
  onDeactivate: (user: ExtendedUser) => void
  onMakeAdmin: (user: ExtendedUser) => void
}) {
  // Remove the openDropdownId state and click outside handler
  // Let the DropdownMenu component handle its own open state

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {["#", "Name", "Email", "Level", "Role", "Categories", "Status", "Actions"].map((col, idx) => (
              <TableHead key={col} className={idx === 0 ? "w-[50px]" : idx === 7 ? "w-[80px]" : ""}>
                {["Name", "Email", "Level", "Role", "Categories", "Status"].includes(col) ? (
                  <Button variant="ghost" onClick={() => onSort(col.toLowerCase())} className="flex items-center gap-1">
                    {col} <ArrowUpDown className="h-4 w-4" />
                  </Button>
                ) : (
                  col
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.profile_img || "/placeholder.svg"} />
                    <AvatarFallback>{user.first_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {user.first_name}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{typeof user.level === "string" ? user.level : String(user.level)}</TableCell>
              <TableCell>
                {Array.isArray(user.role) ? (
                  user.role.map((r, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 mr-1"
                    >
                      {typeof r === "object" && r !== null ? r.role_name : String(r)}
                    </span>
                  ))
                ) : typeof user.role === "object" && user.role !== null ? (
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                    {user.role.role_name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(user.categories) ? (
                    user.categories.map((r, i) => (
                      <span
                        key={i}
                        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 mr-1"
                      >
                        {typeof r === "object" && r !== null ? r.title : String(r)}
                      </span>
                    ))
                  ) : typeof user.categories === "object" && user.categories !== null ? (
                    <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                      {(user.categories as Category).title
                        ? (user.categories as Category).title
                        : String(user.categories)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {user.status ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(user)}>Edit user</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDeactivate(user)}>
                      {user.status ? "Deactivate user" : "Activate user"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-medium" onClick={() => onMakeAdmin(user)}>
                      {Array.isArray(user.role)
                        ? user.role.some((r) => r && typeof r === "object" && r.role_name === "ADMIN")
                          ? "Remove Admin"
                          : "Make Admin"
                        : typeof user.role === "object" && user.role?.role_name === "ADMIN"
                          ? "Remove Admin"
                          : "Make Admin"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function EditUserDialog({
  user,
  isOpen,
  onClose,
  onSave,
}: {
  user: ExtendedUser | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: Partial<ExtendedUser>) => void
}) {
  const { dropdownData } = useMasterDropdown()
  const [edited, setEdited] = useState<Partial<ExtendedUser>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isRolesOpen, setIsRolesOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const rolesDropdownRef = useRef<HTMLDivElement>(null)
  const categoriesDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      // Ensure unique roles and filter out any null/undefined values
      const initialRole = Array.isArray(user.role)
        ? [...new Map(user.role.filter((r) => r && r._id).map((r) => [r._id, r])).values()]
        : user.role && user.role._id
          ? [user.role]
          : []

      // Ensure unique categories
      const initialCategories = Array.isArray(user.categories)
        ? [...new Map(user.categories.map((c) => [c._id, c])).values()]
        : []

      setEdited({
        first_name: user.first_name,
        level: user.level,
        role: initialRole,
        categories: initialCategories,
        profile_img: user.profile_img,
      })
      setImagePreview(user.profile_img || null)
    }
  }, [user])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(event.target as Node)) {
        setIsRolesOpen(false)
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setEdited({ ...edited, profile_img: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleClose = () => {
    setEdited({})
    setImagePreview(null)
    setIsRolesOpen(false)
    setIsCategoriesOpen(false)
    onClose()
  }

  const handleRoleChange = (role: Role, isChecked: boolean) => {
    setEdited((prev) => {
      const currentRoles: Role[] = Array.isArray(prev.role) ? prev.role : []
      // Remove any existing role with the same ID before adding
      const filteredRoles = currentRoles.filter((r) => r._id !== role._id)
      const updatedRoles = isChecked ? [...filteredRoles, role] : filteredRoles
      return { ...prev, role: updatedRoles }
    })
  }

  const handleCategoryChange = (category: Category, isChecked: boolean) => {
    setEdited((prev) => {
      const currentCategories: Category[] = Array.isArray(prev.categories) ? prev.categories : []
      // Remove any existing category with the same ID before adding
      const filteredCategories = currentCategories.filter((c) => c._id !== category._id)
      const updatedCategories = isChecked ? [...filteredCategories, category] : filteredCategories
      return { ...prev, categories: updatedCategories }
    })
  }

  const handleSave = async () => {
    try {
      if (!user?._id) {
        throw new Error("User ID is required")
      }
      setIsSaving(true)

      const formData = new FormData()

      formData.append("first_name", edited.first_name || "")
      const levelId = typeof edited.level === "object" && edited.level !== null ? edited.level.name : edited.level
      formData.append("level", levelId || "")

      // Append each category ID as categories[]
      if (Array.isArray(edited.categories)) {
        edited.categories.forEach((category: Category) => {
          if (category._id) {
            formData.append("categories[]", category._id)
          }
        })
      }

      // Append each role ID as role[]
      if (Array.isArray(edited.role)) {
        edited.role.forEach((role: Role) => {
          if (role._id) {
            formData.append("role[]", role._id)
          }
        })
      }

      onSave(edited)
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error("Failed to update user")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 pt-2 space-y-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-muted">
                  <AvatarImage src={imagePreview || user?.profile_img || "/placeholder.svg"} alt="User avatar" />
                  <AvatarFallback>{user?.first_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <KeenIcon icon="pencil" className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Click the pencil icon to change profile image</p>
            </div>

            <Separator />

            {/* Editable Fields */}
            <div>
              <h3 className="text-sm font-medium mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={edited.first_name || ""}
                    onChange={(e) => setEdited({ ...edited, first_name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={
                      typeof edited.level === "object" && edited.level !== null
                        ? edited.level._id
                        : typeof user?.level === "object" && user?.level !== null
                          ? user.level._id
                          : String(user?.level || edited.level)
                    }
                    onValueChange={(value) => {
                      const selectedLevel = dropdownData.levelList.find((l: Level) => l._id === value)
                      setEdited({ ...edited, level: selectedLevel || value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownData.levelList.map((level: Level) => (
                        <SelectItem key={level._id} value={level._id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Roles Section */}
            <div>
              <h3 className="text-sm font-medium mb-3">Roles & Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2" ref={rolesDropdownRef}>
                  <label className="text-sm font-medium">Roles</label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto min-h-10 py-2"
                      onClick={() => setIsRolesOpen(!isRolesOpen)}
                    >
                      {Array.isArray(edited.role) && edited.role.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {edited.role.map((r: Role) => (
                            <Badge key={r._id} variant="default" className="text-xs">
                              {r.role_name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Select roles</span>
                      )}
                    </Button>

                    {isRolesOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                        <ScrollArea className="h-[200px]">
                          <div className="p-2 space-y-1">
                            {dropdownData.roles.map((role: Role) => {
                              const isChecked = Array.isArray(edited.role)
                                ? edited.role.some((r: Role) => r._id === role._id)
                                : false

                              return (
                                <div
                                  key={role._id}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md"
                                  onClick={() => handleRoleChange(role, !isChecked)}
                                >
                                  <Checkbox
                                    id={`role-${role._id}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      handleRoleChange(role, checked as boolean)
                                    }}
                                  />
                                  <label htmlFor={`role-${role._id}`} className="text-sm cursor-pointer flex-1">
                                    {role.role_name}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2" ref={categoriesDropdownRef}>
                  <label className="text-sm font-medium">Categories</label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto min-h-10 py-2"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                      {Array.isArray(edited.categories) && edited.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {edited.categories.map((c: Category) => (
                            <Badge key={c._id} variant="outline" className="text-xs">
                              {c.title}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Select categories</span>
                      )}
                    </Button>

                    {isCategoriesOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                        <ScrollArea className="h-[200px]">
                          <div className="p-2 space-y-1">
                            {dropdownData.categories.map((category: Category) => {
                              const isChecked = Array.isArray(edited.categories)
                                ? edited.categories.some((c: Category) => c._id === category._id)
                                : false

                              return (
                                <div
                                  key={category._id}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md"
                                  onClick={() => handleCategoryChange(category, !isChecked)}
                                >
                                  <Checkbox
                                    id={`category-${category._id}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                                  />
                                  <label htmlFor={`category-${category._id}`} className="text-sm cursor-pointer flex-1">
                                    {category.title}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Non-editable Info */}
            <div>
              <h3 className="text-sm font-medium mb-3">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Email</label>
                  <div className="text-sm p-2 bg-muted rounded-md">{user?.email || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Status</label>
                  <div className="text-sm p-2">
                    <Badge variant={user?.status ? "default" : "destructive"} className="text-xs">
                      {user?.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Created At</label>
                  <div className="text-sm p-2 bg-muted rounded-md">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Updated At</label>
                  <div className="text-sm p-2 bg-muted rounded-md">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminUsersPage() {
  const { dropdownData } = useMasterDropdown()
  const [users, setUsers] = useState<ExtendedUser[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null)

  // Centralized dialog management
  const [adminDialog, setAdminDialog] = useState<{ isOpen: boolean; user: ExtendedUser | null }>({
    isOpen: false,
    user: null,
  })

  const [deactivateDialog, setDeactivateDialog] = useState<{ isOpen: boolean; user: ExtendedUser | null }>({
    isOpen: false,
    user: null,
  })

  const navigate = useNavigate()

  useEffect(() => {
    getAllUsers().then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        setUsers(
          res.data.map((user: any) => ({
            ...user,
            first_name: user.first_name || "",
            level: user.level || "N/A",
            categories: user.categories || [],
            status: user.status || false,
            profile_img: user.profile_img || "",
            role: user.role || "N/A",
          })),
        )
      }
    })
  }, [])

  const handleDeactivateUser = async (user: ExtendedUser) => {
    setDeactivateDialog({ isOpen: true, user })
  }

  const confirmDeactivateUser = async () => {
    if (deactivateDialog.user?._id) {
      try {
        const response = await deactiveateUser(deactivateDialog.user._id)
        if (response && response.data && response.data.success) {
          toast.success("User status changed successfully")
          setUsers((prev) => prev.map((u) => (u._id === deactivateDialog.user?._id ? { ...u, status: !u.status } : u)))
        } else {
          toast.error("Failed to change user status")
        }
      } catch (error) {
        toast.error("Failed to change user status")
      } finally {
        setDeactivateDialog({ isOpen: false, user: null })
      }
    }
  }

  const handleMakeAdmin = (user: ExtendedUser) => {
    setAdminDialog({ isOpen: true, user })
  }

  const confirmMakeAdmin = async () => {
    if (adminDialog.user?._id) {
      try {
        const response = await Makeandremoveadmin(adminDialog.user._id)
        if (response?.status === 200) {
          toast.success("User role changed successfully")
          // Refresh the page to get updated user data
          navigate("/admin/allUsers")
        } else {
          toast.error("Failed to update user role")
        }
      } catch (error) {
        toast.error("Failed to update user role")
      } finally {
        setAdminDialog({ isOpen: false, user: null })
      }
    }
  }

  const getSortedAndFilteredUsers = () => {
    let result = [...users]
    if (searchQuery) {
      result = result.filter((user) =>
        [user.first_name, user.email, formatRole(user.role), user.level].some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
      )
    }
    if (sortColumn) {
      result.sort((a, b) => {
        let aValue, bValue
        if (sortColumn === "role") {
          aValue = formatRole(a.role)
          bValue = formatRole(b.role)
        } else if (sortColumn === "level") {
          aValue = formatLevel(a.level)
          bValue = formatLevel(b.level)
        } else {
          aValue = a[sortColumn as keyof ExtendedUser]
          bValue = b[sortColumn as keyof ExtendedUser]
        }
        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      })
    }
    return result
  }

  const handleSave = async (editedData: Partial<ExtendedUser>) => {
    if (!editingUser) return
    try {
      const userId = editingUser._id
      if (!userId) throw new Error("User ID is required")
      const formData = new FormData()
      formData.append("first_name", editedData.first_name || "")
      const levelId =
        typeof editedData.level === "object" && editedData.level !== null ? editedData.level._id : editedData.level
      formData.append("level", levelId || "")
      if (Array.isArray(editedData.categories))
        editedData.categories.forEach((c: Category) => c._id && formData.append("categories[]", c._id))
      if (Array.isArray(editedData.role))
        editedData.role.forEach((r: Role) => r._id && formData.append("role[]", r._id))
      if (editedData.profile_img) {
        formData.append("profile_img", editedData.profile_img)
      }
      const response = await updateUser(userId, formData)
      if (response && response.success) {
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? { ...user, ...editedData } : user)))
        toast.success("User updated successfully")
      } else {
        toast.error("Failed to update user")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error("Failed to update user")
    } finally {
      setEditingUser(null)
    }
  }

  return (
    <div className="space-y-4 p-6">
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UserTable
        users={getSortedAndFilteredUsers()}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(col) => {
          if (col === sortColumn) setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
          else {
            setSortColumn(col)
            setSortDirection("asc")
          }
        }}
        onEdit={setEditingUser}
        onDeactivate={handleDeactivateUser}
        onMakeAdmin={handleMakeAdmin}
      />

      <EditUserDialog
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />

      {/* Admin Role Dialog */}
      <Dialog open={adminDialog.isOpen} onOpenChange={(open) => !open && setAdminDialog({ isOpen: false, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p>
            {Array.isArray(adminDialog.user?.role)
              ? adminDialog.user?.role.some((r) => r && typeof r === "object" && r.role_name === "ADMIN")
                ? `Are you sure you want to remove ${adminDialog.user?.first_name} as admin?`
                : `Are you sure you want to make ${adminDialog.user?.first_name} an admin?`
              : typeof adminDialog.user?.role === "object" && adminDialog.user?.role?.role_name === "ADMIN"
                ? `Are you sure you want to remove ${adminDialog.user?.first_name} as admin?`
                : `Are you sure you want to make ${adminDialog.user?.first_name} an admin?`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminDialog({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button onClick={confirmMakeAdmin}>
              {Array.isArray(adminDialog.user?.role)
                ? adminDialog.user?.role.some((r) => r && typeof r === "object" && r.role_name === "ADMIN")
                  ? "Remove Admin"
                  : "Make Admin"
                : typeof adminDialog.user?.role === "object" && adminDialog.user?.role?.role_name === "ADMIN"
                  ? "Remove Admin"
                  : "Make Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate User Dialog */}
      <Dialog
        open={deactivateDialog.isOpen}
        onOpenChange={(open) => !open && setDeactivateDialog({ isOpen: false, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{deactivateDialog.user?.status ? "Deactivate User" : "Activate User"}</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to {deactivateDialog.user?.status ? "deactivate" : "activate"}{" "}
            {deactivateDialog.user?.first_name}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateDialog({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button onClick={confirmDeactivateUser} variant={deactivateDialog.user?.status ? "destructive" : "default"}>
              {deactivateDialog.user?.status ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
