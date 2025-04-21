import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <Button className="text-sm hover:underline" onClick={handleViewProfile}>
          View Profile
        </Button>
      </div>
    </Card>
  );
}
