import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow, TableHeader } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { KeenIcon } from '@/components';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function CreateReasons() {
  const handleAddReason = () => {
    const newReason = {
      reason: '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin'
    };
    setReasons((prev) => [...prev, newReason]);
    setEditIndex(reasons.length); // Set the new reason in edit mode
    setEditedReason({ reason: '' }); // Initialize the editedReason state
  };

  const [reasons, setReasons] = useState([
    { reason: 'Reason 1', createdAt: '2023-10-01', createdBy: 'Admin' },
    { reason: 'Reason 2', createdAt: '2023-10-02', createdBy: 'Admin' }
  ]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedReason, setEditedReason] = useState<{ reason: string }>({ reason: '' });

  const handleEdit = (index: number | null) => {
    setEditIndex(index);
    if (index !== null) {
      setEditedReason({ reason: reasons[index].reason });
    }
  };

  const handleSave = () => {
    const updatedReasons = [...reasons];
    if (editIndex !== null) {
      updatedReasons[editIndex].reason = editedReason.reason;
    }
    setReasons(updatedReasons);
    setEditIndex(null);
  };

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setEditedReason((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-6">
      <Card className="p-6">
        <CardHeader className="font-bold mb-4 flex flex-row items-center justify-between">
          <CardTitle>Force Close Reasons</CardTitle>

          <CardTitle>
            <Button onClick={handleAddReason}>Add Reason</Button>
          </CardTitle>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableCell className="font-medium">Reason</TableCell>
            <TableCell className="font-medium">Created At</TableCell>
            <TableCell className="font-medium">Created By</TableCell>
            <TableCell className="font-medium">Actions</TableCell>
          </TableHeader>
          <TableBody>
            {reasons.map((reason, index) => (
              <TableRow key={index} className="">
                <TableCell>
                  {editIndex === index ? (
                    <Input name="reason" value={editedReason.reason} onChange={handleInputChange} />
                  ) : (
                    reason.reason
                  )}
                </TableCell>
                <TableCell>{reason.createdAt}</TableCell>
                <TableCell>{reason.createdBy}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {editIndex === index ? (
                      <Button variant="default" size="sm" onClick={handleSave}>
                        <KeenIcon icon="file-up" />
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={() => handleEdit(index)}>
                        <KeenIcon icon="pencil" />
                      </Button>
                    )}
                    <Button variant="destructive" size="sm">
                      <KeenIcon icon="trash" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
