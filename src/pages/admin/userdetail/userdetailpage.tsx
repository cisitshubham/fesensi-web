import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input'; 
import { useState, useEffect } from 'react';
import { getUserById } from '@/api/api'; // Import API function to fetch user details
import { useParams, useNavigate } from 'react-router-dom'; // ✅ Correct hooks

import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function UserDetailPage() {
  const { id } = useParams(); // ✅ Get user ID from route params
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    if (id) {
      const fetchUserDetails = async () => {
        const response = await getUserById(id); // ID is a string from useParams
        if (response?.success) {
          setUser(response.data); // Update user state with fetched data
        }
      };
      fetchUserDetails();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            {['name', 'email', 'phone', 'address', 'role'].map((field) => (
              <TableRow key={field}>
                <TableCell className="capitalize">{field}</TableCell>
                <TableCell>
                  {editMode ? (
                    <Input name={field} value={(user as any)[field]} onChange={handleInputChange} />
                  ) : (
                    (user as any)[field]
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <div className="flex space-x-4">
        <Button variant="default" onClick={() => setEditMode(!editMode)}>
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
