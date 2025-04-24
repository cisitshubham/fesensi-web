'use client';

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
export default function CreateCategory() {
  const { dropdownData } = useMasterDropdown();
  const [categories, setCategories] = useState<MasterDropdownDatatype['categories']>(
    dropdownData.categories || []
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedCategory, setEditedCategory] = useState<{ title: string }>({ title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = () => {
    const newCategory = {
      _id: `temp-${Date.now()}`, // Generate a temporary unique ID
      title: '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin'
    };
    setCategories((prev) => [...prev, newCategory]);
    setEditIndex(categories.length); // Set the new category in edit mode
    setEditedCategory({ title: '' }); // Initialize the editedCategory state
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedCategory({ title: categories[index].title });
  };

  const handleSave = async () => {
    if (!editedCategory.title.trim()) {
      toast.error('Category title cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedCategories = [...categories];
      if (editIndex !== null) {
        updatedCategories[editIndex].title = editedCategory.title.trim();
      }

      // Here you would typically call your API to save the changes
      // await createCategories(updatedCategories)

      setCategories(updatedCategories);
      setEditIndex(null);

      toast.success('Category saved successfully');
    } catch (error) {
      toast.error('Failded to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // If it's a new category, remove it
    if (editIndex === categories.length - 1 && categories[editIndex]._id.startsWith('temp-')) {
      setCategories(categories.slice(0, -1));
    }
    setEditIndex(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (index: number) => {
    setIsSubmitting(true);

    try {
      const updatedCategories = categories.filter((_, i) => i !== index);

      // Here you would typically call your API to delete the category
      // await deleteCategory(categories[index]._id)

      setCategories(updatedCategories);

      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
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
              <CardTitle className="text-2xl font-bold">Categories</CardTitle>
              <CardDescription className="mt-1">Manage your product categories</CardDescription>
            </div>
            <Button
              onClick={handleAddCategory}
              className="flex items-center gap-1"
              disabled={editIndex !== null || isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Click "Add Category" to create one.
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
                  {categories.map((category, index) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        {editIndex === index ? (
                          <Input
                            name="title"
                            value={editedCategory.title}
                            onChange={handleInputChange}
                            placeholder="Enter category title"
                            autoFocus
                            className="max-w-md"
                          />
                        ) : (
                          <span className="font-medium">
                            {category.title || (
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
