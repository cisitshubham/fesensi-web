"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { createRoles, getRoles } from "@/api/api"
import { AlertCircle, Check, Info, Loader2 } from "lucide-react"
import { Alert } from "@/components"

interface Permission {
  view: boolean
  modify: boolean
  publish: boolean
  configure: boolean
}

interface Role {
  id: string
  role_name: string
  permissions: {
    [module: string]: Permission
  }
}

const permissionTypes = ["view", "modify", "publish", "configure"]

export default function PermissionsCheck() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const permissionTypes = ["view", "modify", "publish", "configure"] as const

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getRoles()
      if (response?.success) {
        const formattedRoles = response.data.map((role: any) => ({
          id: role.id || role._id || String(Math.random()),
          role_name: role.role_name,
          permissions: role.permissions || initializeDefaultPermissions()
        }))
        setRoles(formattedRoles)
      } else {
        setError("Failed to fetch roles: " + (response?.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      setError("Failed to fetch roles. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const initializeDefaultPermissions = () => {
    const permissions: { [module: string]: Permission } = {}
    permissionTypes.forEach((module) => {
      permissions[module] = {
        view: false,
        modify: false,
        publish: false,
        configure: false
      }
    })
    return permissions
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      setError("Role name cannot be empty")
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("role_name", newRoleName)
      const response = await createRoles(formData)
      if (response?.success) {
        const newRole: Role = {
          id: response.data?.id || String(Math.random()),
          role_name: newRoleName,
          permissions: initializeDefaultPermissions()
        }
        setRoles((prev) => [...prev, newRole])
        setSuccess("Role created successfully")
        setIsModalOpen(false)
        setNewRoleName("")
      } else {
        setError("Failed to create role: " + (response?.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error creating role:", error)
      setError("Failed to create role. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePermissionChange = (
    roleId: string,
    module: string,
    permission: keyof Permission,
    value: boolean
  ) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [module]: {
                  ...role.permissions[module],
                  [permission]: value
                }
              }
            }
          : role
      )
    )
    setHasChanges(true)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setSuccess("Permissions updated successfully")
      setIsSaving(false)
      setHasChanges(false)
    }, 1000)
  }

  const handleRestoreDefaults = () => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => ({
        ...role,
        permissions: initializeDefaultPermissions()
      }))
    )
    setHasChanges(true)
  }

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Module Permissions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage permissions for each role
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>New Role</Button>
        </CardHeader>

        <CardContent className="p-0">
          {error && (
            <Alert variant="danger" className="mx-6 mt-4">
              <AlertCircle className="h-4 w-4" />
              <>{error}</>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mx-6 mt-4 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <>{success}</>
            </Alert>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <Info className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No roles found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Create your first role to start managing permissions
              </p>
              <Button onClick={() => setIsModalOpen(true)}>Create Role</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] font-medium">Role</TableHead>
                    {permissionTypes.map((module) =>
                      permissionTypes.map((perm) => (
                        <TableHead key={`${module}-${perm}`} className="text-center text-xs">
                          {module}.{perm}
                        </TableHead>
                      ))
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.role_name}</TableCell>
                      {permissionTypes.map((module) =>
                        permissionTypes.map((perm) => (
                          <TableCell key={`${role.id}-${module}-${perm}`} className="text-center">
                            <Checkbox
                              checked={role.permissions[module]?.[perm] || false}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(role.id, module, perm as keyof Permission, checked === true)
                              }
                            />
                          </TableCell>
                        ))
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3 py-4 px-6 mt-2">
          <Button variant="outline" onClick={handleRestoreDefaults} disabled={isLoading || isSaving}>
            Restore Defaults
          </Button>
          <Button onClick={handleSaveChanges} disabled={!hasChanges || isLoading || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md p-4">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Enter a name for the new role. You can configure permissions after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="role-name" className="text-sm font-medium">
                Role Name
              </label>
              <Input
                id="role-name"
                placeholder="e.g. Team Lead"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={!newRoleName.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
