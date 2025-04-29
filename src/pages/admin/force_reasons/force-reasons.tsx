import type React from 'react';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, X, Check, Loader2 } from 'lucide-react';
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
import type { MasterDropdownDatatype } from '@/types';
import toast from 'react-hot-toast';

export default function CreateReasons() {
  const { dropdownData } = useMasterDropdown();
  const [reasons, setReasons] = useState<MasterDropdownDatatype['resolvedPostList']>(
    dropdownData.resolvedPostList || []
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedReason, setEditedReason] = useState<{ title: string }>({ title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddReason = () => {
    const newReason = {
      _id: `temp-${Date.now()}`, // Generate a temporary unique ID
      title: '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin'
    };
    setReasons((prev) => [...prev, newReason]);
    setEditIndex(reasons.length); // Set the new reason in edit mode
    setEditedReason({ title: '' }); // Initialize the editedReason state
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedReason({ title: reasons[index].title });
  };

  const handleSave = async () => {
    if (!editedReason.title.trim()) {
      toast.error('Reason title cannot be empty', { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedReasons = [...reasons];
      if (editIndex !== null) {
        updatedReasons[editIndex].title = editedReason.title.trim();
      }

      // Here you would typically call your API to save the changes
      // await createCloseReasons(updatedReasons)

      setReasons(updatedReasons);
      setEditIndex(null);

      toast.success('Reason saved successfully', { position: "top-center" });
    } catch (error) {
      toast.error('Failed to save reason', { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // If it's a new reason, remove it
    if (editIndex === reasons.length - 1 && reasons[editIndex]._id.startsWith('temp-')) {
      setReasons(reasons.slice(0, -1));
    }
    setEditIndex(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedReason((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (index: number) => {
    setIsSubmitting(true);

    try {
      const updatedReasons = reasons.filter((_, i) => i !== index);

      // Here you would typically call your API to delete the reason
      // await deleteCloseReason(reasons[index]._id)

      setReasons(updatedReasons);

      toast.success('Reason deleted successfully', { position: "top-center" });
    } catch (error) {
      toast.error('Failed to delete reason', { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Close Reasons</CardTitle>
              <CardDescription className="mt-1">Manage your close reasons</CardDescription>
            </div>
            <Button
              onClick={handleAddReason}
              className="flex items-center gap-1"
              disabled={editIndex !== null || isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add Reason
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reasons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reasons found. Click "Add Reason" to create one.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70%]">Title</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reasons.map((reason, index) => (
                    <TableRow key={reason._id}>
                      <TableCell>
                        {editIndex === index ? (
                          <Input
                            name="title"
                            value={editedReason.title}
                            onChange={handleInputChange}
                            placeholder="Enter reason title"
                            autoFocus
                            className="max-w-md"
                          />
                        ) : (
                          <span className="font-medium">
                            {reason.title || (
                              <span className="text-muted-foreground italic">Untitled</span>
                            )}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editIndex === index ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSave}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(index)}
                                disabled={editIndex !== null || isSubmitting}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDelete(index)}
                                disabled={editIndex !== null || isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
