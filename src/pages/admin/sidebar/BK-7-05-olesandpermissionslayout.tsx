import { Fragment, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GetPermissionsList } from '@/api/api';
import { PageNavbar } from '@/pages/account';
import { Permission } from '@/types';

import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UpdatePermissions } from '@/api/api';

interface Role {
  _id: string;
  name: string;
  description: string;
}

interface SelectedRole {
  _id: string;
  role_name: string;
  permissions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type RolePermissions = {
  roleId: string;
  permissions: {
    selected: string[];
    all: string[];
  };
};

interface RolesAndPermissionsProps {
  onPermissionsChange?: (permissions: RolePermissions) => void;
}

export default function RolesAndPermissions({ onPermissionsChange = () => {} }: RolesAndPermissionsProps) {
  const [permissionsList, setPermissionsList] = useState<Permission[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);
  const [initialSelectedPermissions, setInitialSelectedPermissions] = useState<string[]>([]);

  const masterdropdown = useMasterDropdown();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await GetPermissionsList();
        const permissions = response.data;
        setPermissionsList(permissions);
        
        const roles: Role[] = Array.from(
          new Set(permissions.map((p: Permission) => p.role))
        ).map((value: unknown) => {
          const roleId = value as string;
          return {
            _id: roleId,
            name: roleId,
            description: ''
          };
        });
        setRolesList(roles);

        const initialCheckboxState = permissions.reduce((acc: Record<string, boolean>, p: Permission) => {
          acc[p._id] = initialSelectedPermissions.includes(p._id);
          return acc;
        }, {} as Record<string, boolean>);
        setSelectedPermissions(initialCheckboxState);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast.error('Failed to fetch permissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialSelectedPermissions]);

  const handleRoleChange = (roleId: string) => {
    const selectedRoleData = masterdropdown.dropdownData.roles.find((role: SelectedRole) => role._id === roleId);
    if (selectedRoleData) {
      setSelectedRole(selectedRoleData);
      setInitialSelectedPermissions(selectedRoleData.permissions);
    }
  }

  // Group permissions by role
  const permissionsByRole = rolesList.reduce((acc, role) => {
    acc[role._id] = permissionsList.filter((p) => p.role === role._id);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Handlers
  const handleSelectAll = (roleId: string) => {
    const rolePermissions = permissionsByRole[roleId] || [];
    const areAllSelected = rolePermissions.every((p) => selectedPermissions[p._id]);

    const updatedState = { ...selectedPermissions };
    rolePermissions.forEach((p) => {
      updatedState[p._id] = !areAllSelected;
    });

    setSelectedPermissions(updatedState);
    notifyPermissionsChange(selectedRole?._id || '', updatedState);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const updated = {
        ...prev,
        [permissionId]: !prev[permissionId]
      };
      notifyPermissionsChange(selectedRole?._id || '', updated);
      return updated;
    });
  };

  const notifyPermissionsChange = (roleId: string, permissions: Record<string, boolean>) => {
    const selectedPermissions = Object.keys(permissions).filter(key => permissions[key]);
    const allPermissions = Object.keys(permissions);
    
    const permissionsData: RolePermissions = {
      roleId,
      permissions: {
        selected: selectedPermissions,
        all: allPermissions
      }
    };
    
    onPermissionsChange(permissionsData);
  };

  const handleUpdatePermissions = async () => {
    if (!selectedRole) return;
    
    const formData = new FormData();
    formData.append('roleId', selectedRole._id);
    const updatedPermissions = Object.keys(selectedPermissions).filter((key) => selectedPermissions[key]);
    
    // Send each permission ID separately
    updatedPermissions.forEach(permissionId => {
      formData.append('permissions[]', permissionId);
    });
    
    try {
      const response = await UpdatePermissions(formData);
      toast.success('Permissions updated successfully');
    } catch (error) {
      toast.error('Failed to update permissions');
      console.error(error);
    }
  };

  return (
    <Fragment>
      <PageNavbar />

      <Card className="mx-8 mb-4">
        <CardHeader>
          <CardTitle>Roles and Permissions</CardTitle>
          <div className="flex flex-row gap-2 justify-between">
            <Select onValueChange={handleRoleChange}>
              <SelectTrigger className='w-1/6'>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {masterdropdown.dropdownData.roles.map((role: SelectedRole) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.role_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant={'default'} 
              onClick={handleUpdatePermissions} 
              className='w-fit'
              disabled={!selectedRole}
            >
              Update Permissions
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="mx-8">
        <CardContent className="p-4">
          {!selectedRole ? (
            <div className="flex justify-center items-center p-4">
              <p className="text-gray-500">Please select a role to view permissions</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rolesList.map((role) => (
                <div key={role._id} className=" p-4 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">{role.name}</h2>

                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      checked={permissionsByRole[role._id]?.every(
                        (p) => selectedPermissions[p._id]
                      )}
                      onCheckedChange={() => handleSelectAll(role._id)}
                    />
                    <span className="text-sm">Select All</span>
                  </div>

                  <div className="space-y-3">
                    {permissionsByRole[role._id]?.map((permission) => (
                      <div key={permission._id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-gray-500">{permission.method}</div>
                          </div>
                          <Checkbox
                            checked={selectedPermissions[permission._id]}
                            onCheckedChange={() => handlePermissionToggle(permission._id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Fragment>
  );
}
