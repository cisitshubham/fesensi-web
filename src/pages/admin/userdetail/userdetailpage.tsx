import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input'; 
import { useState } from 'react';

export default function UserDetailPage() {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: 'Aadesh Kumar',
    email: 'aadesh@example.com',
    phone: '+1234567890',
    address: '123 Main Street, City, Country',
    role: 'Admin'
  });

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <div className="px-6 space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-medium">Field</TableCell>
              <TableCell className="font-medium">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>
                {editMode ? (
                  <Input name="name" value={user.name} onChange={handleInputChange} />
                ) : (
                  user.name
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>
                {editMode ? (
                  <Input name="email" value={user.email} onChange={handleInputChange} />
                ) : (
                  user.email
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Phone</TableCell>
              <TableCell>
                {editMode ? (
                  <Input name="phone" value={user.phone} onChange={handleInputChange} />
                ) : (
                  user.phone
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>
                {editMode ? (
                  <Input name="address" value={user.address} onChange={handleInputChange} />
                ) : (
                  user.address
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>
                {editMode ? (
                  <Input name="role" value={user.role} onChange={handleInputChange} />
                ) : (
                  user.role
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <div className="flex space-x-4">
        <Button variant="default" onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Save' : 'Edit'}
        </Button>
        {!editMode && <Button variant="destructive">Deactivate and logout</Button>}
      </div>
    </div>
  );
}
