import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, updateUser, getRoles } from '@/api/api';
import { User } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const AVAILABLE_CATEGORIES = ['general', 'support', 'sales', 'marketing'];

export default function UserDetailPage() {
  const { id } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<User>({
    _id: '',
    name: '',
    email: '',
    level: '',
    role: [],
    categories: [],
    profile_img: '',
    status: false,
    createdAt: '',
    updatedAt: '',
  });
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const response = await getUserById(id);
      if (response?.success) {
        const data = response.data;
        setUser({
          _id: data._id || '',
          profile_img: data.profile_img || '',
          status: data.status || false,
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
          name: data.name || data.first_name || '',
          email: data.email || '',
          level: data.level || '',
          role: Array.isArray(data.role)
            ? data.role.map((r: any) => r.role_name || '')
            : [],
          categories: data.categories || [],
        });
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await getRoles();
      if (response?.success) {
        setAvailableRoles(response.data.map((role: any) => role.role_name));
      } else {
        console.error('Failed to fetch roles:', response?.message);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setUser((prev) => ({
      ...prev,
      role: prev.role?.includes(role)
        ? prev.role.filter((r) => r !== role)
        : [...(prev.role || []), role],
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setUser((prev) => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...(prev.categories || []), category],
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await updateUser(user._id, formData);
      if (response?.success) {
        setEditMode(false);
        console.log('User updated successfully');
      } else {
        console.error('Failed to update user:', response?.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="px-6 space-y-6">
      <Card className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.profile_img} alt={user.name} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">User Details</h1>
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
              if (['_id', 'profile_img'].includes(key)) return null;

              if (key === 'name' || key === 'email') {
                return (
                  <TableRow key={key}>
                    <TableCell className="capitalize">{key}</TableCell>
                    <TableCell>
                      {editMode ? (
                        <Input
                          name={key}
                          value={value as string}
                          onChange={handleInputChange}
                        />
                      ) : (
                        value || <span className="text-muted-foreground italic">Not provided</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }

              if (key === 'role') {
                return (
                  <TableRow key={key}>
                    <TableCell className="capitalize">Role</TableCell>
                    <TableCell>
                      {editMode ? (
                        <div className="flex flex-col space-y-2">
                          {availableRoles.map((role) => (
                            <label key={role} className="flex items-center space-x-2">
                              <Checkbox
                                checked={(user.role ?? []).includes(role)}
                                onCheckedChange={() => handleRoleToggle(role)}
                              />
                              <span>{role}</span>
                            </label>
                          ))}
                        </div>
                      ) : (user.role ?? []).length > 0 ? (
                        (user.role?.join(', ') ?? <span className="text-muted-foreground italic">No roles assigned</span>)
                      ) : (
                        <span className="text-muted-foreground italic">No roles assigned</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }

              if (key === 'categories') {
                return (
                  <TableRow key={key}>
                    <TableCell className="capitalize">Categories</TableCell>
                    <TableCell>
                      {editMode ? (
                        <div className="flex flex-col space-y-2">
                          {AVAILABLE_CATEGORIES.map((category) => (
                            <label key={category} className="flex items-center space-x-2">
                              <Checkbox
                                checked={(user.categories ?? []).includes(category)}
                                onCheckedChange={() => handleCategoryToggle(category)}
                              />
                              <span>{category}</span>
                            </label>
                          ))}
                        </div>
                      ) : (user.categories ?? []).length > 0 ? (
                        (user.categories?.join(', ') ?? <span className="text-muted-foreground italic">No categories selected</span>)
                      ) : (
                        <span className="text-muted-foreground italic">No categories selected</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }

              return (
                <TableRow key={key}>
                  <TableCell className="capitalize">{key.replace(/_/g, ' ')}</TableCell>
                  <TableCell>
                    {typeof value === 'boolean'
                      ? value.toString()
                      : value || <span className="text-muted-foreground italic">Not provided</span>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="flex space-x-4">
        <Button variant="default" onClick={() => (editMode ? handleSave() : setEditMode(true))}>
          {editMode ? 'Save' : 'Edit'}
        </Button>
        {!editMode && (
          <Button variant="destructive" onClick={() => console.log('Deactivate user logic')}>
            Deactivate and logout
          </Button>
        )}
      </div>
    </div>
  );
}
