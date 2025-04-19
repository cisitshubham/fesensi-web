import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { KeenIcon } from '@/components';
import { Button } from '@/components/ui/button';
export default function UserListCard({
  user
}: {
  user: { id: number; name: string; email: string };
}) {
  return (
    <Card key={user.id} className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <Button className="text-sm  hover:underline">View Profile</Button>
      </div>
    </Card>
  );
}
