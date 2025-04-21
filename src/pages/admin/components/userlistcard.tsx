import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom'; 

export default function UserListCard({ user }: { user: User }) {
  const navigate = useNavigate(); 

  const firstNameInitial = user.first_name?.charAt(0) || '';
  const profileImg = user.profile_img || '';

  const handleViewProfile = () => {
    const userId = user._id;
    if (userId) {
      navigate(`/admin/user/${userId}`);
    }
  };

  function tolocalestring(createdAt: string | undefined): import("react").ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <Card key={user._id} className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar>
          {profileImg ? (
            <img src={profileImg} alt={`${user.first_name}'s profile`} />
          ) : (
            <AvatarFallback>{firstNameInitial}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{user.first_name || 'Unknown'}</p>
          <p className="text-sm text-muted-foreground">{user.email || 'No email provided'}</p>
          <p className="text-sm text-muted-foreground">
            {user.createdAt instanceof Date
              ? user.createdAt.toLocaleString()
              : user.createdAt || 'No date provided'}
          </p>
          {user.level && <p className="text-sm text-muted-foreground">Level: {user.level}</p>}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <Badge variant={user.status ? 'default' : 'destructive'}>
          {user.status ? 'Active' : 'Inactive'}
        </Badge>
        <Button className="text-sm hover:underline" onClick={handleViewProfile}>
          View Profile
        </Button>
      </div>
    </Card>
  );
}
