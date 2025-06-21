import { Makeandremoveadmin } from "@/api/admin"
import { useEffect, useState, useRef, Fragment } from "react"
import { getAllUsers, updateUser } from "@/api/api"
import { MoreHorizontal, SearchIcon, X } from "lucide-react"
import { deactiveateUser } from "@/api/admin"
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
import { Input } from "@/components/ui/input"
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Container, KeenIcon } from "@/components"
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
  onEdit,
  onDeactivate,
  onMakeAdmin,
}: {
  users: ExtendedUser[]
  onEdit: (user: ExtendedUser) => void
  onDeactivate: (user: ExtendedUser) => void
  onMakeAdmin: (user: ExtendedUser) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {["#", "Name", "Email", "Level", "Role", "Categories", "Status", "Actions"].map((col, idx) => (
              <TableHead key={col} className={idx === 0 ? "w-[50px]" : idx === 7 ? "w-[80px]" : ""}>
                {col}
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
                  ) : null}
                  {!Array.isArray(user.categories) && (
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
                    <DropdownMenuItem className="" onClick={() => onDeactivate(user)}>
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



const handleRoleChange = (
  role: Role,
  isChecked: boolean,
  setEdited: (update: (prev: Partial<ExtendedUser>) => Partial<ExtendedUser>) => void
) => {
  setEdited((prev) => {
    const currentRoles: Role[] = Array.isArray(prev.role) ? prev.role : [];
    const filteredRoles = currentRoles.filter((r) => r._id !== role._id);
    const updatedRoles = isChecked ? [...filteredRoles, role] : filteredRoles;
    return { ...prev, role: updatedRoles };
  });
};

const handleCategoryChange = (
  category: Category,
  isChecked: boolean,
  setEdited: (update: (prev: Partial<ExtendedUser>) => Partial<ExtendedUser>) => void
) => {
  setEdited((prev) => {
    const currentCategories: Category[] = Array.isArray(prev.categories) ? prev.categories : [];
    const filteredCategories = currentCategories.filter((c) => c._id !== category._id);
    const updatedCategories = isChecked ? [...filteredCategories, category] : filteredCategories;
    return { ...prev, categories: updatedCategories };
  });
};

// Add dialog-specific styles
const dialogStyles = {
  base: "rounded-lg shadow-lg p-0 border border-border bg-background",
  backdrop: "backdrop:bg-black/50",
  width: {
    default: "min-w-[320px]",
    large: "w-full max-w-2xl"
  }
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const adminDialogRef = useRef<HTMLDialogElement>(null);
  const deactivateDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const { dropdownData, loading: dropdownLoading, error: dropdownError, refreshDropdownData } = useMasterDropdown();
  
  // Debug dropdownData
  useEffect(() => {
    if (dropdownError) {
      console.error('Dropdown Error:', dropdownError);
      toast.error("Failed to load dropdown data");
    }
  }, [dropdownData, dropdownError]);

  // Refresh dropdown data when editing user

 

  const [edited, setEdited] = useState<Partial<ExtendedUser>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isRolesOpen, setIsRolesOpen] = useState(false)
  const [isLevelOpen, setIsLevelOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isAgentRole, setIsAgentRole] = useState(false)
  const rolesDropdownRef = useRef<HTMLDivElement>(null)
  const levelDropdownRef = useRef<HTMLDivElement>(null)
  const categoriesDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(event.target as Node)) {
        setIsRolesOpen(false);
      }
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
        setIsLevelOpen(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  useEffect(() => {
    if (selectedUser && dropdownData?.levelList?.length) {
      const initialRole = Array.isArray(selectedUser.role)
        ? [...new Map(selectedUser.role.filter((r) => r && r._id).map((r) => [r._id, r])).values()]
        : selectedUser.role && selectedUser.role._id
          ? [selectedUser.role]
          : []

      const initialCategories = Array.isArray(selectedUser.categories)
        ? [...new Map(selectedUser.categories.map((c) => [c._id, c])).values()]
        : []

      // Find the matching level object from dropdownData
      const matchingLevel = dropdownData.levelList.find((l: Level) => 
        typeof selectedUser.level === "string" 
          ? l.name === selectedUser.level 
          : selectedUser.level && typeof selectedUser.level === "object" && l._id === selectedUser.level._id
      );

      setEdited({
        first_name: selectedUser.first_name,
        level: matchingLevel || selectedUser.level, // Use the matching level object if found
        role: initialRole,
        categories: initialCategories,
        profile_img: selectedUser.profile_img,
      })
      setImagePreview(selectedUser.profile_img || null)
    }
  }, [selectedUser, dropdownData?.levelList]) // Add dropdownData.levelList as dependency

  // Fetch users data
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
          }))
        );
      }
    });
  }, []);
  // Filter users based on search query
  const getFilteredUsers = () => {
    let result = [...users];
    if (searchQuery) {
      result = result.filter((user) =>
        [user.first_name, user.email, formatRole(user.role), user.level].some((field) =>
          String(field || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    return result;
  };

  // Handle user deactivation
  const handleDeactivateUser = (user: ExtendedUser) => {
    setSelectedUser(user);
    deactivateDialogRef.current?.showModal();
  };
  const confirmDeactivateUser = async () => {
    if (selectedUser?._id) {
      try {
        const response = await deactiveateUser(selectedUser._id);
        if (response && response.data && response.data.success) {
          // Update the local state with all user data, not just the status
          setUsers((prev) => prev.map((u) => {
            if (u._id === selectedUser._id) {
              return {
                ...u,
                status: !u.status,
                ...response.data.user // Merge any additional updated fields from response
              };
            }
            return u;
          }));
          toast.success("User status changed successfully", {position:"top-center"});
        } else {
          toast.error("Failed to change user status", {position:"top-center"});
        }
      } catch (error) {
        toast.error("Failed to change user status", {position:"top-center"});
      } finally {
        deactivateDialogRef.current?.close();
        setSelectedUser(null); // Reset selected user
      }
    }
  };
  // Handle admin role assignment
  const handleMakeAdmin = (user: ExtendedUser) => {
    setSelectedUser(user);
    // Ensure dropdownData is loaded
    if (!dropdownData?.roles?.length) {
      refreshDropdownData();
    }
    adminDialogRef.current?.showModal();
  };
  const confirmMakeAdmin = async () => {
    if (selectedUser?._id) {
      try {
        const response = await Makeandremoveadmin(selectedUser._id);
        if (response?.status === 200 && response.data) {
          // Try to get role data from the response
          if (response.data.user?.role) {
            setUsers((prev) => prev.map((user) => 
              user._id === selectedUser._id ? { ...user, role: response.data.user.role } : user
            ));
          } else {
            // Fallback to local update
            const isCurrentlyAdmin = Array.isArray(selectedUser.role)
              ? selectedUser.role.some((r: Role) => r.role_name === "ADMIN")
              : typeof selectedUser.role === "object" && selectedUser.role?.role_name === "ADMIN";

            const adminRole = dropdownData?.roles?.find((role: Role) => role.role_name === "ADMIN") || {
              _id: "admin",
              role_name: "ADMIN",
              permissions: [],
              status: "active",
              createdAt: new Date().toISOString()
            };

            setUsers((prev) => prev.map((user) => {
              if (user._id === selectedUser._id) {
                const currentRoles = Array.isArray(user.role) ? user.role : [user.role].filter(Boolean);
                return {
                  ...user,
                  role: isCurrentlyAdmin 
                    ? currentRoles.filter((r: Role) => r.role_name !== "ADMIN")
                    : [...currentRoles, adminRole]
                };
              }
              return user;
            }));
          }
          toast.success("User role changed successfully", {position: "top-center"});
        } else {
          toast.error("Failed to update user role", {position: "top-center"});
        }
      } catch (error) {
        toast.error("Failed to update user role", {position: "top-center"});
        console.error("Error updating admin role:", error);
      } finally {
        adminDialogRef.current?.close();
        setSelectedUser(null);
      }
    }
  };

  // Handle user data saving
  const handleSaveUser = async () => {
    if (!selectedUser) return;
    try {
      setIsSaving(true);
      const userId = selectedUser._id;
      if (!userId) throw new Error("User ID is required");
      
      const formData = new FormData();
      formData.append("first_name", edited.first_name || "");
      const levelId = typeof edited.level === "object" && edited.level !== null ? edited.level.name : edited.level;
      formData.append("level", levelId || "");
      
      if (Array.isArray(edited.categories)) {
        edited.categories.forEach((c: Category) => c._id && formData.append("categories[]", c._id));
      }
      
      if (Array.isArray(edited.role)) {
        edited.role.forEach((r: Role) => r._id && formData.append("role[]", r._id));
      }
      
      if (edited.profile_img) {
        formData.append("profile_img", edited.profile_img);
      }
      
      const response = await updateUser(userId, formData);
        if (response && response.success) {
        setUsers((prevUsers) => prevUsers.map((user) => {
          if (user._id === userId) {
            // Convert edited data for table display
            const updatedUser: ExtendedUser = {
              ...user,
              ...edited,
              // Ensure level is either a string or Level object, defaulting to original value if undefined
              level: levelId || user.level || "N/A"
            };
            return updatedUser;
          }
          return user;
        }));
        toast.success("User updated successfully",{position:"top-center"});
        editDialogRef.current?.close();
        setSelectedUser(null);
        setEdited({});
      } else {
        toast.error("Failed to update user", {position:"top-center"});
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to update user", {position:"top-center"});
    } finally {
      setIsSaving(false);
    }
  };

  const closeEditDialog = () => {
    editDialogRef.current?.close();
    setSelectedUser(null);
    setEdited({});
    setImagePreview(null);
    setIsRolesOpen(false);
    setIsLevelOpen(false);
    setIsCategoriesOpen(false);
  };

  useEffect(() => {
    // Handle click outside for dialogs
    const handleDialogClick = (e: MouseEvent) => {
      const target = e.target as HTMLDialogElement;
      if (target.tagName.toLowerCase() === 'dialog') {
        target.close();
      }
    };

    const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog');
    dialogs.forEach(dialog => {
      dialog.addEventListener('click', handleDialogClick);
    });

    return () => {
      dialogs.forEach(dialog => {
        dialog.removeEventListener('click', handleDialogClick);
      });
    };
  }, []);

  useEffect(() => {
    // Update isAgentRole whenever edited.role changes
    const hasAgentRole = Array.isArray(edited.role) 
      ? edited.role.some((r: Role) => r.role_name === "AGENT")
      : false;
    setIsAgentRole(hasAgentRole);
  }, [edited.role]);

  return (
    <Fragment>
      <Container>
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <UserTable
          users={getFilteredUsers()}
        onEdit={(user) => {
          setSelectedUser(user);
          editDialogRef.current?.showModal();
        }}
        onDeactivate={handleDeactivateUser}
        onMakeAdmin={handleMakeAdmin}
      />

      {/* Admin Role Dialog */}
      <dialog ref={adminDialogRef} className={`${dialogStyles.base} ${dialogStyles.width.default} ${dialogStyles.backdrop}`}>
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Confirm Action</h2>
          </div>
          <p className="mb-4">
            {Array.isArray(selectedUser?.role)
              ? selectedUser?.role.some((r) => r && typeof r === "object" && r.role_name === "ADMIN")
                ? `Are you sure you want to remove ${selectedUser?.first_name} as admin?`
                : `Are you sure you want to make ${selectedUser?.first_name} an admin?`
              : typeof selectedUser?.role === "object" && selectedUser?.role?.role_name === "ADMIN"
                ? `Are you sure you want to remove ${selectedUser?.first_name} as admin?`
                : `Are you sure you want to make ${selectedUser?.first_name} an admin?`}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => adminDialogRef.current?.close()}>Cancel</Button>
            <Button onClick={confirmMakeAdmin}>
              {Array.isArray(selectedUser?.role)
                ? selectedUser?.role.some((r) => r && typeof r === "object" && r.role_name === "ADMIN")
                  ? "Remove Admin"
                  : "Make Admin"
                : typeof selectedUser?.role === "object" && selectedUser?.role?.role_name === "ADMIN"
                  ? "Remove Admin"
                  : "Make Admin"}
            </Button>
          </div>
        </div>
      </dialog>

      {/* Deactivate User Dialog */}
      <dialog ref={deactivateDialogRef} className={`${dialogStyles.base} ${dialogStyles.width.default} ${dialogStyles.backdrop}`}>
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {selectedUser?.status ? "Deactivate User" : "Activate User"}
            </h2>
          </div>
          <p className="mb-4">
            Are you sure you want to {selectedUser?.status ? "deactivate" : "activate"} {selectedUser?.first_name}?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => deactivateDialogRef.current?.close()}>Cancel</Button>
            <Button onClick={confirmDeactivateUser} variant={selectedUser?.status ? "destructive" : "default"}>
              {selectedUser?.status ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </dialog>

      {/* Edit User Dialog */}
      <dialog ref={editDialogRef} className={`${dialogStyles.base} ${dialogStyles.width.large} ${dialogStyles.backdrop}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Edit User</h2>
            <Button variant="ghost" size="icon" onClick={closeEditDialog}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {selectedUser && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    <AvatarImage src={imagePreview || selectedUser?.profile_img || "/placeholder.svg"} alt="User avatar" />
                    <AvatarFallback>{selectedUser?.first_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
     
                </div>
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
                  </div>                  <div className="space-y-2" ref={levelDropdownRef}>
                    <label className="text-sm font-medium">Level</label>
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto min-h-10 py-2"
                        onClick={() => setIsLevelOpen(!isLevelOpen)}
                        disabled={!Array.isArray(edited.role) || !edited.role.some((r: Role) => r.role_name === "AGENT")}
                      >
                        {dropdownLoading ? (
                          <span className="text-muted-foreground">Loading...</span>
                        ) : typeof edited.level === "object" && edited.level?.name ? (
                          <span>{edited.level.name}</span>
                        ) : typeof edited.level === "string" && dropdownData?.levelList ? (
                          <span>
                            {dropdownData.levelList.find((level: { _id: string | Level | undefined }) => level._id === edited.level)?.name || "Select level"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {Array.isArray(edited.role) && edited.role.some((r: Role) => r.role_name === "AGENT") 
                              ? "Select level" 
                              : "Level selection requires AGENT role"}
                          </span>
                        )}
                      </Button>

                      {isLevelOpen && Array.isArray(edited.role) && edited.role.some((r: Role) => r.role_name === "AGENT") && (
                        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                          <ScrollArea className="h-fit max-h-[200px]">
                            <div className="p-2 space-y-1">
                              {dropdownLoading ? (
                                <div className="p-2 text-sm text-muted-foreground">Loading levels...</div>
                              ) : dropdownError ? (
                                <div className="p-2 text-sm text-destructive">Error loading levels</div>
                              ) : dropdownData?.levelList && dropdownData.levelList.length > 0 ? (
                                dropdownData.levelList.map((level: Level) => (
                                  <div
                                    key={level._id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md"
                                    onClick={() => {
                                      setEdited((prev) => ({ ...prev, level }));
                                      setIsLevelOpen(false);
                                    }}
                                  >
                                    <span className="text-sm flex-1">{level.name}</span>
                                    {typeof edited.level === "object" && edited.level !== null && edited.level._id === level._id && (
                                      <KeenIcon icon="check" className="h-4 w-4" />
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="p-2 text-sm text-muted-foreground">No levels available</div>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
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
                        ) : typeof edited.role === "string" && dropdownData?.roles ? (
                          <span>
                            {dropdownData.roles.find((r: { _id: Role | Role[] | undefined }) => r._id === edited.role)?.role_name || "Select roles"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Select roles</span>
                        )}
                      </Button>

                      {isRolesOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                          <ScrollArea className="h-fit max-h-[200px]">
                            <div className="p-2 space-y-1">
                              {dropdownData.roles.map((role: Role) => {
                                const isChecked = Array.isArray(edited.role)
                                  ? edited.role.some((r: Role) => r._id === role._id)
                                  : false;

                                return (
                                  <div
                                    key={role._id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md"
                                    onClick={() => handleRoleChange(role, !isChecked, setEdited)}
                                  >
                                    <Checkbox
                                      id={`role-${role._id}`}
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        handleRoleChange(role, checked as boolean, setEdited);
                                      }}
                                    />
                                    <label
                                      htmlFor={`role-${role._id}`}
                                      className="text-sm cursor-pointer flex-1"
                                    >
                                      {role.role_name}
                                    </label>
                                  </div>
                                );
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
                        disabled={!isAgentRole}
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
                          <span className="text-muted-foreground">
                            {isAgentRole ? "Select categories" : "Category selection requires AGENT role"}
                          </span>
                        )}
                      </Button>

                      {isCategoriesOpen && isAgentRole && (
                        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                          <ScrollArea className="h-[200px]">
                            <div className="p-2 space-y-1">
                              {dropdownData.categories.map((category: Category) => {
                                const isChecked = Array.isArray(edited.categories)
                                  ? edited.categories.some((c: Category) => c._id === category._id)
                                  : false;

                                return (
                                  <div
                                    key={category._id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md"
                                    onClick={() => handleCategoryChange(category, !isChecked, setEdited)}
                                  >
                                    <Checkbox
                                      id={`category-${category._id}`}
                                      checked={isChecked}
                                      onCheckedChange={(checked) =>
                                        handleCategoryChange(category, checked as boolean, setEdited)
                                      }
                                    />
                                    <label
                                      htmlFor={`category-${category._id}`}
                                      className="text-sm cursor-pointer flex-1"
                                    >
                                      {category.title}
                                    </label>
                                  </div>
                                );
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
                    <div className="text-sm p-2 bg-muted rounded-md">{selectedUser?.email || "N/A"}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Status</label>
                    <div className="text-sm p-2">
                      <Badge variant={selectedUser?.status ? "default" : "destructive"} className="text-xs">
                        {selectedUser?.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Created At</label>
                    <div className="text-sm p-2 bg-muted rounded-md">
                      {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Updated At</label>
                    <div className="text-sm p-2 bg-muted rounded-md">
                      {selectedUser?.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={closeEditDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </dialog>
      </Container>

    </Fragment>
  );
}

// Create a separate EditUserForm component to handle the form logic
function EditUserForm({ user, onSave }: { user: ExtendedUser; onSave: (data: Partial<ExtendedUser>) => void }) {
  const { dropdownData } = useMasterDropdown();
    const [edited, setEdited] = useState<Partial<ExtendedUser>>({
      first_name: user.first_name,
      level: user.level,
      role: Array.isArray(user.role) ? user.role : [user.role],
      categories: user.categories,
      profile_img: user.profile_img,
    });
  
    // Placeholder return to avoid syntax error; implement as needed
    return null;
  }
