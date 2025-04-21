import { useEffect, useState } from 'react';
import { getAllUsers } from '@/api/api';
import { User } from '@/types';
import UserListCard from '../components/userlistcard';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();

      if (response?.success && Array.isArray(response.data)) {
        const formattedData = response.data.map((user: User) => ({
          ...user,
          role: Array.isArray(user.role)
            ? user.role.map((r) => r.role_name).join(', ')
            : 'N/A',
        }));
        setUsers(formattedData);
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="px-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <div className="grid gap-4">
        {users.map((user) => (
          <UserListCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}
