import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow, TableHeader } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { KeenIcon } from '@/components';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { createCategories } from '@/api/api';

export default function CreateCategory() {
  const handleAddCategory = () => {
    const newCategory = {
      name: '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin'
    };
    setCategories((prev) => [...prev, newCategory]);
    setEditIndex(categories.length); // Set the new category in edit mode
    setEditedCategory({ name: '' }); // Initialize the editedCategory state
  };

  const [categories, setCategories] = useState([
    { name: 'Category 1', createdAt: '2023-10-01', createdBy: 'Admin' },
    { name: 'Category 2', createdAt: '2023-10-02', createdBy: 'Admin' }
  ]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedCategory, setEditedCategory] = useState<{ name: string }>({ name: '' });

  const handleEdit = (index: number | null) => {
    setEditIndex(index);
    if (index !== null) {
      setEditedCategory({ name: categories[index].name });
    }
  };

  const handleSave = () => {
    const updatedCategories = [...categories];
    if (editIndex !== null) {
      updatedCategories[editIndex].name = editedCategory.name;
    }
    setCategories(updatedCategories);
    setEditIndex(null);
  };

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-6">
      <Card className="p-6">
        <CardHeader className=" font-bold mb-4 flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>

          <CardTitle>
            <Button onClick={handleAddCategory}>Add category</Button>
          </CardTitle>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableCell className="font-medium">Name</TableCell>
            <TableCell className="font-medium">Created At</TableCell>
            <TableCell className="font-medium">Created By</TableCell>
            <TableCell className="font-medium">Actions</TableCell>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={index} className="">
                <TableCell>
                  {editIndex === index ? (
                    <Input name="name" value={editedCategory.name} onChange={handleInputChange} />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>{category.createdAt}</TableCell>
                <TableCell>{category.createdBy}</TableCell>
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
