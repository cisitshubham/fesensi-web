import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function RoleAndPermissionCard() {
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      name: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero quasi aspernatur corporis excepturi sequi aliquid, hic officia dolore illo ad sint necessitatibus suscipit. Magni cum rerum voluptatum debitis dignissimos in similique autem enim nostrum! Vitae nihil iure ut quae aspernatur voluptate voluptas labore necessitatibus consectetur.'
    },
    {
      id: 2,
      name: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor aspernatur libero vero, fugit porro similique veniam dolorum qui doloribus debitis.'
    },
    {
      id: 3,
      name: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, reprehenderit.'
    },
    {
      id: 4,
      name: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum at dolorum aperiam!'
    },
    { id: 5, name: 'Permission 5' }
  ]);

  const [isEditingAll, setIsEditingAll] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState([...permissions]);

  const handleEditAllClick = () => {
    setIsEditingAll(true);
  };

  const handleSaveAllClick = () => {
    setPermissions(editedPermissions);
    setIsEditingAll(false);
  };

  const handlePermissionChange = (id: number, newName: string) => {
    setEditedPermissions((prev) =>
      prev.map((permission) =>
        permission.id === id ? { ...permission, name: newName } : permission
      )
    );
  };

  return (
    <Card className="">
      <CardContent className="flex flex-row items-center justify-between p-4">
        <div className="w-1/4 text-lg font-semibold text-gray-700">ROLE</div>
        <Separator orientation="vertical" />
        <div className="w-3/4  space-y-2">
          {permissions.map((permission) => (
            <div key={permission.id} className="w-full flex  space-x-2">
              {isEditingAll ? (
                <Textarea
                  value={editedPermissions.find((p) => p.id === permission.id)?.name}
                  onChange={(e) => handlePermissionChange(permission.id, e.target.value)}
                  className="py-1 px-2 border rounded-md backdrop-brightness-75"
                />
              ) : (
                <span className="py-1 px-2 border rounded-md w-full backdrop-brightness-75">
                  {permission.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <Separator className="my-2" />
      <CardFooter>
        {isEditingAll ? (
          <button
            onClick={handleSaveAllClick}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save All
          </button>
        ) : (
          <button
            onClick={handleEditAllClick}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
