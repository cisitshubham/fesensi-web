"use client"

import { Fragment, useEffect, useState } from "react"
import { toast } from "sonner"
import { PageNavbar } from "@/pages/account"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Save,
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertCircle,
  ChevronDown,
} from "lucide-react"
import { GetPermissionsList, UpdatePermissions } from "@/api/api"
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context"
import type { Permission } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Role {
  _id: string
  name: string
  description: string
}

interface SelectedRole {
  _id: string
  role_name: string
  permissions: string[]
  status: string
  createdAt: string
  updatedAt: string
}

export type RolePermissions = {
  roleId: string
  permissions: {
    selected: string[]
    all: string[]
  }
}

interface RolesAndPermissionsProps {
  onPermissionsChange?: (permissions: RolePermissions) => void
}

export default function RolesAndPermissions({ onPermissionsChange = () => {} }: RolesAndPermissionsProps) {
  const [permissionsList, setPermissionsList] = useState<Permission[]>([])
  const [rolesList, setRolesList] = useState<Role[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null)
  const [initialSelectedPermissions, setInitialSelectedPermissions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const masterdropdown = useMasterDropdown()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await GetPermissionsList()
        const permissions = response?.data ?? []
        setPermissionsList(permissions)

        const roles: Role[] = Array.from(new Set(permissions.map((p: Permission) => p.role))).map(
          (roleId: unknown) => ({
            _id: roleId as string,
            name: roleId as string,
            description: "",
          }),
        )
        setRolesList(roles)

        if (roles.length > 0 && !activeRoleId) {
          setActiveRoleId(roles[0]._id)
        }

        // Initialize selected permissions
        const initialState = permissions.reduce((acc: Record<string, boolean>, p: Permission) => {
          acc[p._id] = initialSelectedPermissions.includes(p._id)
          return acc
        }, {})
        setSelectedPermissions(initialState)
      } catch (error) {
        console.error("Error fetching permissions:", error)
        toast.error("Failed to fetch permissions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [initialSelectedPermissions, activeRoleId])

  const handleRoleChange = (roleId: string) => {
    const selectedRoleData = masterdropdown.dropdownData.roles.find((role: SelectedRole) => role._id === roleId)
    if (selectedRoleData) {
      setSelectedRole(selectedRoleData)
      setInitialSelectedPermissions(selectedRoleData.permissions)
      setHasChanges(false)
    }
  }

  const permissionsByRole = rolesList.reduce((acc, role) => {
    acc[role._id] = permissionsList.filter((p) => p.role === role._id)
    return acc
  }, {} as Record<string, Permission[]>)

  const filteredPermissions =
    activeRoleId && permissionsByRole[activeRoleId]
      ? permissionsByRole[activeRoleId].filter((p) =>
          searchQuery
            ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.method.toLowerCase().includes(searchQuery.toLowerCase())
            : true,
        )
      : []

  const notifyPermissionsChange = (roleId: string, permissions: Record<string, boolean>) => {
    const selected = Object.keys(permissions).filter((key) => permissions[key])
    const all = Object.keys(permissions)

    onPermissionsChange({
      roleId,
      permissions: {
        selected,
        all,
      },
    })
  }

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const updated = { ...prev, [permissionId]: !prev[permissionId] }
      if (selectedRole) notifyPermissionsChange(selectedRole._id, updated)
      setHasChanges(true)
      return updated
    })
  }

  const handleSelectAll = (roleId: string) => {
    const rolePermissions = permissionsByRole[roleId] ?? []
    const allSelected = rolePermissions.every((p) => selectedPermissions[p._id])

    const updatedState = { ...selectedPermissions }
    rolePermissions.forEach((p) => {
      updatedState[p._id] = !allSelected
    })

    setSelectedPermissions(updatedState)
    if (selectedRole) notifyPermissionsChange(selectedRole._id, updatedState)
    setHasChanges(true)
  }

  const handleUpdatePermissions = async () => {
    if (!selectedRole) return

    const formData = new FormData()
    formData.append("roleId", selectedRole._id)
    Object.keys(selectedPermissions)
      .filter((key) => selectedPermissions[key])
      .forEach((permissionId) => formData.append("permissions[]", permissionId))

    try {
      await UpdatePermissions(formData)
      toast.success("Permissions updated successfully")
      setHasChanges(false)
    } catch (error) {
      toast.error("Failed to update permissions")
      console.error(error)
    }
  }

  const handleResetPermissions = () => {
    if (!selectedRole) return

    const resetState = permissionsList.reduce((acc: Record<string, boolean>, p: Permission) => {
      acc[p._id] = initialSelectedPermissions.includes(p._id)
      return acc
    }, {})

    setSelectedPermissions(resetState)
    setHasChanges(false)
  }

  const getSelectedCount = (roleId: string) => {
    const rolePermissions = permissionsByRole[roleId] ?? []
    return rolePermissions.filter((p) => selectedPermissions[p._id]).length
  }

  return (
    <Fragment>
      <PageNavbar />

      <div className="mx-auto max-w-7xl">
        <Card className="flex flex-row items-center text-center justify-center w-full mb-4">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">Manage role permissions and access control</p>
          </CardContent>
     
        </Card>
      

        {!selectedRole ? (
          <Card className="border-dashed border-primary/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a Role to Manage</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Choose a role from the list below to view and manage its permissions.
              </p>
              <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
                {masterdropdown.dropdownData.roles.map((role: SelectedRole) => (
                  <Button
                    key={role._id}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    onClick={() => handleRoleChange(role._id)}
                  >
                    <Users className="h-6 w-6" />
                    <span>{role.role_name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Permission Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="px-1">
                      {rolesList.map((role) => (
                        <Button
                          key={role._id}
                          variant={activeRoleId === role._id ? "outline" : "ghost"}
                          className="w-full justify-start mb-1"
                          onClick={() => setActiveRoleId(role._id)}
                        >
                          <div className="flex items-center w-full justify-between">
                            <span className="truncate">{role.name}</span>
                            <Badge
                              variant="outline"
                              className="ml-auto bg-primary/10 text-primary border-primary/20"
                            >
                              {getSelectedCount(role._id)}/{permissionsByRole[role._id]?.length ?? 0}
                            </Badge>
                            {activeRoleId === role._id && <ChevronRight className="h-4 w-4 ml-1 text-primary" />}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Card className="mb-4">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {selectedRole && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                              {selectedRole.role_name}
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-[200px]">
                            {masterdropdown.dropdownData.roles.map((role: SelectedRole) => (
                              <DropdownMenuItem
                                key={role._id}
                                onClick={() => handleRoleChange(role._id)}
                                className="cursor-pointer"
                              >
                                {role.role_name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </CardTitle>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleSelectAll(activeRoleId ?? "")}
                        disabled={!activeRoleId}
                      >
                        {activeRoleId &&
                        permissionsByRole[activeRoleId]?.every((p) => selectedPermissions[p._id])
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                      <Button variant="outline" onClick={handleResetPermissions} disabled={!hasChanges}>
                        Reset
                      </Button>
                      <Button variant={hasChanges ? "default" : "outline"} onClick={handleUpdatePermissions} disabled={!hasChanges}>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
{/* 
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div> */}

              {filteredPermissions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center ">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Permissions Found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {searchQuery
                        ? "No permissions match your search criteria."
                        : "No permissions available for this role."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-380px)] p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPermissions.map((permission) => (
                          <div
                            key={permission._id}
                            className={`p-4 rounded-md border ${
                              selectedPermissions[permission._id] ? "bg-muted/30 border-primary" : "border-muted"
                            } transition-colors`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <div className="font-medium flex items-center gap-2">
                                  {permission.name}
                                  {selectedPermissions[permission._id] ? (
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  {permission.method.toUpperCase()}
                                </Badge>
                              </div>
                              <Checkbox
                                checked={selectedPermissions[permission._id]}
                                onCheckedChange={() => handlePermissionToggle(permission._id)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 py-3">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredPermissions.length} permissions
                      </div>

                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  )
}
