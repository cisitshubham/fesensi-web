import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleAndPermissionCard from '../components/roleAndPerissionCard';
import { Button } from '@/components/ui/button';
export default function RolesAndPermissions() {
  return (
    <div className="px-8">
      <Card className="">
        <CardHeader className='flex flex-row items-center justify-between p-4'>
          <CardTitle>Roles and RolesAndPermissions</CardTitle>
          <Button>Add</Button>
          
        </CardHeader>

        <CardContent>
          <RoleAndPermissionCard />
        </CardContent>
      </Card>
    </div>
  );
}
