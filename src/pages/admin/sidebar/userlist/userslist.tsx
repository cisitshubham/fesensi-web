"use client"

import type React from "react"

import { useEffect, useMemo, useState, useRef } from "react"
import { getAllUsers } from "@/api/api"
import { MoreHorizontal, ArrowUpDown, SearchIcon, X } from "lucide-react"
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
// Types
interface Category {
  _id: string
  title: string
}
interface Role {
  _id: string
  role_name: string
}
interface Level {
  _id: string
  level_name: string
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
function Search({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
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
      <Button>Add User</Button>
    </div>
  )
}

function UserTable({
  users,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
}: {
  users: ExtendedUser[]
  sortColumn: string | null
  sortDirection: "asc" | "desc"
  onSort: (column: string) => void
  onEdit: (user: ExtendedUser) => void
}) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleEdit = (user: ExtendedUser) => {
    setOpenDropdownId(null);
    onEdit(user);
  };

  const formatCategories = (categories: Category[]) => {
    if (!categories || categories.length === 0) return "N/A";
    return categories.map(cat => cat.title).join(", ");
  };

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
              <TableCell>{formatLevel(user.level)}</TableCell>
              <TableCell>{formatRole(user.role)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.categories && user.categories.length > 0 ? (
                    user.categories.map((category) => (
                      <span
                        key={category._id}
                        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {category.title}
                      </span>
                    ))
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
                <DropdownMenu open={openDropdownId === user._id} onOpenChange={(open) => setOpenDropdownId(open ? user._id : null)}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(user)}>Edit user</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Deactivate user</DropdownMenuItem>
                    <DropdownMenuItem className="font bold">Make Admin</DropdownMenuItem>
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
  const [edited, setEdited] = useState<Partial<ExtendedUser>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setEdited({
        first_name: user.first_name,
        level: user.level,
        role: user.role,
        categories: user.categories,
      })
      setImagePreview(user.profile_img || null)
    }
  }, [user])

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
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] p-4" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-3 pb-2 border-b">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || user?.profile_img || "/placeholder.svg"} />
                <AvatarFallback>{user?.first_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <SearchIcon className="h-4 w-4" />
                <span className="sr-only">Change profile image</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Click the icon to change profile image</p>
          </div>

          {/* Editable Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={edited.first_name || ""}
                onChange={(e) => setEdited({ ...edited, first_name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Level</label>
              <Select
                value={(edited.level as any)?._id || ""}
                onValueChange={(val) => {
                  setEdited({
                    ...edited,
                    level: { _id: val, level_name: val },
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {["L1", "L2", "L3"].map((val) => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={(edited.role as any)?._id || ""}
                onValueChange={(val) => {
                  setEdited({
                    ...edited,
                    role: { _id: val, role_name: val },
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {["admin", "user", "manager"].map((val) => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Categories</label>
              <Select
                value={(edited.categories as any)?.[0]?._id || ""}
                onValueChange={(val) => {
                  const update = val.split(",").map((id) => ({ _id: id, title: id }))
                  setEdited({ ...edited, categories: update })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {["cat1", "cat2", "cat3"].map((val) => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Non-editable Fields */}
          <div className="mt-2 pt-4 border-t">
            <h3 className="text-sm font-medium mb-3">User Information (Non-editable)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <div className="text-sm p-2 bg-muted rounded-md">{user?.email || "N/A"}</div>
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-muted-foreground">Status</label>
                <div className="text-sm p-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${user?.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {user?.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-muted-foreground">Created At</label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-muted-foreground">Updated At</label>
                <div className="text-sm p-2 bg-muted rounded-md">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(edited)
              handleClose()
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ExtendedUser[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null)

  useEffect(() => {
    getAllUsers().then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        setUsers(
          res.data.map(
            (user: { first_name: any; level: any; categories: any; status: any; profile_img: any; role: any }) => ({
              ...user,
              first_name: user.first_name || "",
              level: user.level || "N/A",
              categories: user.categories || [],
              status: user.status || false,
              profile_img: user.profile_img || "",
              role: user.role || "N/A",
            }),
          ),
        )
      }
    })
  }, [])

  const sortedUsers = useMemo(() => {
    const compare = (a: any, b: any) => {
      if (sortColumn === "role") {
        a = formatRole(a.role)
        b = formatRole(b.role)
      } else if (sortColumn === "level") {
        a = formatLevel(a.level)
        b = formatLevel(b.level)
      } else {
        a = a[sortColumn as keyof ExtendedUser]
        b = b[sortColumn as keyof ExtendedUser]
      }

      return sortDirection === "asc" ? String(a).localeCompare(String(b)) : String(b).localeCompare(String(a))
    }
    return sortColumn ? [...users].sort(compare) : users
  }, [users, sortColumn, sortDirection])

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user) =>
      [user.first_name, user.email, formatRole(user.role), formatLevel(user.level)].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    )
  }, [sortedUsers, searchQuery])

  return (
    <div className="space-y-4 p-6">
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UserTable
        users={filteredUsers}
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
      />
      <EditUserDialog
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(data) => console.log("Saving:", data)}
      />
    </div>
  )
}
