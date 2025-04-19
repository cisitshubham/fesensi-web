import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UserListCard from '../components/userlistcard';
// Dummy data – replace this with API call or props
const users = [
  { id: 1, name: 'Aadesh Kumar', email: 'aadesh@example.com' },
  { id: 2, name: 'John Doe', email: 'john@example.com' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com' }
];

export default function AdminUsersPage() {
  return (
    <div className="px-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <div className="grid gap-4">
        {users.map((user) => (
          <UserListCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
