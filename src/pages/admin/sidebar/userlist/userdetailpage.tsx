"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getUserById, updateUser, getRoles } from "@/api/api"
import type { User } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { DialogOverlay } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context"
import { MasterDropdownDatatype } from "@/types"

interface UserState {
  _id: string;
  name: string;
  email: string;
  level: string;
  role: string[];
  categories: string[];
  profile_img: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function UserDetailPage() {
  const { id } = useParams()
  const [editMode, setEditMode] = useState(false)
  const [user, setUser] = useState<UserState>({
    _id: "",
    name: "",
    email: "",
    level: "",
    role: [],
    categories: [],
    profile_img: "",
    status: false,
  })

  const { dropdownData } = useMasterDropdown()
  console.log(dropdownData)

  const AVAILABLE_CATEGORIES = dropdownData.categories
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [pendingAdminChange, setPendingAdminChange] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchUser = async () => {
      const response = await getUserById(id)
      if (response?.success) {
        const data = response.data
        setUser({
          _id: data._id || "",
          profile_img: data.profile_img || "",
          status: data.status || false,
          createdAt: data.createdAt || "",
          updatedAt: data.updatedAt || "",
          name: data.name || data.first_name || "",
          email: data.email || "",
          level: data.level || "",
          role: Array.isArray(data.role) ? data.role.map((r: any) => r.role_name || "") : [],
          categories: data.categories || [],
        })
      }
    }
    fetchUser()
  }, [id])

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await getRoles()
      if (response?.success) {
        setAvailableRoles(response.data.map((role: any) => role.role_name))
      }
    }
    fetchRoles()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleToggle = (role: string) => {
    setUser((prev) => ({
      ...prev,
      role: prev.role.includes(role) ? prev.role.filter((r) => r !== role) : [...prev.role, role],
    }))
  }

  const handleCategoryToggle = (category: string) => {
    setUser((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    const formdata = {
      ...user,
      profile_img: imageFile ? imagePreview : user.profile_img,
    }
    const formData = new FormData()
    Object.entries(formdata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value))
      }
    })
    const response = await updateUser(user._id, formData)
    if (response?.success) {
      setEditMode(false)
      toast.success("User updated successfully")
    } else {
      toast.error("Failed to update user")
    }
  }

  return (
    <div className="px-6 space-y-6">
      <Card className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={imagePreview || user.profile_img} alt={user.name} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            {editMode && (
              <div className="absolute -bottom-2 -right-2">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-md hover:bg-primary/90 transition-colors">
                    📷
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <Link to="/admin/allUsers">
              <Button variant="outline">View all users</Button>
            </Link>
            <div className="flex items-center space-x-2">
              <label htmlFor="admin-toggle" className="text-sm font-medium">
                Admin Access
              </label>
              <button
                id="admin-toggle"
                type="button"
                role="switch"
                aria-checked={user.role?.includes("admin")}
                onClick={() => {
                  setPendingAdminChange(!user.role?.includes("admin"))
                  setShowAdminDialog(true)
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  user.role?.includes("admin") ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    user.role?.includes("admin") ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(user).map(([key, value]) => {
              if (["_id", "profile_img"].includes(key)) return null

              if (["email", "level"].includes(key)) {
                return (
                  <TableRow key={key}>
                    <TableCell className="capitalize">{key}</TableCell>
                    <TableCell>
                      {editMode ? (
                        <Input name={key} value={value as string} onChange={handleInputChange} />
                      ) : (
                        value || <span className="text-muted-foreground italic">Not provided</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              }

              if (key === "role") {
                return (
                  <TableRow key={key}>
                    <TableCell className="capitalize">Role</TableCell>
                    <TableCell>
                      {editMode ? (
                        <div className="flex flex-col space-y-2">
                          {availableRoles.map((role) => (
                            <label key={role} className="flex items-center space-x-2">
                              <Checkbox
                                checked={user.role?.includes(role)}
                                onCheckedChange={() => handleRoleToggle(role)}
                              />
                              <span>{role}</span>
                            </label>
                          ))}
                        </div>
                      ) : user.role?.length > 0 ? (
                        user.role?.join(", ")
                      ) : (
                        <span className="text-muted-foreground italic">No roles assigned</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              }

              if (key === "categories") {
                return (
                  <TableRow key={key}>
                    <TableCell className="capitalize">Categories</TableCell>
                    <TableCell>
                      {editMode ? (
                        <div className="flex flex-col space-y-2">
                          {AVAILABLE_CATEGORIES.map((category: string) => (
                            <label key={category} className="flex items-center space-x-2">
                              <Checkbox
                                checked={user.categories.includes(category)}
                                onCheckedChange={() => handleCategoryToggle(category)}
                              />
                              <span>{category}</span>
                            </label>
                          ))}
                        </div>
                      ) : user.categories.length > 0 ? (
                        user.categories.join(", ")
                      ) : (
                        <span className="text-muted-foreground italic">No categories selected</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              }

              return (
                <TableRow key={key}>
                  <TableCell className="capitalize">{key.replace(/_/g, " ")}</TableCell>
                  <TableCell>{typeof value === "boolean" ? value.toString() : String(value)}</TableCell>
                </TableRow>
              )
            })}

            {editMode && (
              <TableRow>
                <TableCell>Profile Image</TableCell>
                <TableCell>
                  {imageFile ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">New image selected: {imageFile.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="profile-image-table" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose Image</span>
                      </Button>
                      <input
                        id="profile-image-table"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={() => (editMode ? handleSave() : setEditMode(true))}>
            {editMode ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Admin Role Confirmation Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogOverlay className="fixed inset-0 bg-black/30" />
        <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg">
          <DialogTitle className="text-lg font-semibold">
            {pendingAdminChange ? "Grant Admin Role" : "Remove Admin Role"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            {pendingAdminChange
              ? "Are you sure you want to make this user an admin?"
              : "Are you sure you want to remove admin rights from this user?"}
          </DialogDescription>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const updatedRoles = pendingAdminChange
                  ? [...user.role, "admin"]
                  : user.role.filter((r) => r !== "admin")

                const formData = new FormData()
                formData.append("userId", user._id)
                formData.append("role", updatedRoles.join(","))

                const response = await updateUser(user._id, formData)
                if (response?.success) {
                  setUser((prev) => ({ ...prev, role: updatedRoles }))
                  toast.success("User role updated")
                } else {
                  toast.error("Failed to update user role")
                }
                setShowAdminDialog(false)
              }}
            >
              {pendingAdminChange ? "Make Admin" : "Remove Admin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
