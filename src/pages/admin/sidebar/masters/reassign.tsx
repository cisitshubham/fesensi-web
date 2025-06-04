import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Pencil, Plus, X, Check, Loader2, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
import type { MasterDropdownDatatype } from '@/types';
import { toast } from 'sonner';
import { CreateReassignOptions } from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UpdateReassignOptions } from '@/api/admin';

export default function CresteReassign() {
  const { dropdownData } = useMasterDropdown();
  const [reasons, setReasons] = useState<MasterDropdownDatatype['reassignOptions']>(
    dropdownData.reassignOptions || []
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedReason, setEditedReason] = useState<{ title: string,_id:string }>({ title: '',_id:'' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReasonTitle, setNewReasonTitle] = useState('');
  const navigate = useNavigate();

  const filtered = reasons.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedReason({ title: reasons[index].title, _id: reasons[index]._id });
  };

  const handleSave = async () => {
    if (!editedReason.title.trim()) 
      return toast.error('Reason title cannot be empty',{position:'top-center'});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', editedReason.title.trim());
      const response = await UpdateReassignOptions(editedReason._id,formData);
      if (response.success && editIndex !== null) {
        const updated = [...reasons];
        updated[editIndex].title = editedReason.title.trim();
        setReasons(updated);
        setEditIndex(null);
        toast.success('Reason saved successfully',{position:'top-center'});
      }
    } catch {
      toast.error('Failed to save',{position:'top-center'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleAddReasonSubmit = async () => {
    if (!newReasonTitle.trim()) return toast.error('Reason title cannot be empty',{position:'top-center'});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', newReasonTitle.trim());
      const response = await CreateReassignOptions(formData);


      if (response.success) {
          setShowAddDialog(false);
        toast.success('Reason added successfully',{position:'top-center'});
        setReasons([...reasons, { _id: response.data._id, title: newReasonTitle.trim() }]);
        navigate('/admin/reassign');
      }
    } catch {
      toast.error('Failed to add reason',{position:'top-center'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortByTitle = (order: 'asc' | 'desc') => {
    const sorted = [...reasons].sort((a, b) =>
      order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    setReasons(sorted);
  };

  const ActionButtons = ({ index }: { index: number }) => {
    const isEditing = editIndex === index;
    const canEdit = editIndex === null && !isSubmitting;

    if (isEditing) {
      return (
        <>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </>
      );
    }

    return (
      <>
        <Button variant="outline" size="sm" onClick={() => handleEdit(index)} disabled={!canEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="shadow-md border-slate-200">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Reassign Options</CardTitle>
              <CardDescription className="mt-1">Manage your reassign options</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2" disabled={isSubmitting}>
              <Plus className="h-4 w-4" /> Add Reassign Option
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reasons..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> <span className="hidden sm:inline">Sort</span>
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => sortByTitle('asc')}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortByTitle('desc')}>Name (Z-A)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <Filter className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700">No reasons found</h3>
              <p className="text-slate-500 mt-1">{searchQuery ? "Try a different search term" : 'Click "Add Reason" to create one'}</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[70%]">Title</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((reason, i) => {
                    const index = reasons.findIndex(r => r._id === reason._id);
                    const isEditing = editIndex === index;
                    return (
                      <TableRow key={reason._id} className="group hover:bg-slate-50">
                        <TableCell>
                          {isEditing ? (
                            <Input
                              name="title"
                              value={editedReason.title}
                              onChange={(e) => setEditedReason({ title: e.target.value, _id: reason._id })}
                              autoFocus
                              className="max-w-md"
                              placeholder="Enter reason title"
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{reason.title || <span className="text-muted-foreground italic">Untitled</span>}</span>
                              {reason._id.startsWith('temp-') && (
                                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">New</Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <ActionButtons index={index} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filtered.length} of {reasons.length} reasons
          </div>
        </CardContent>
      </Card>

      {/* Add Reason Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Add New Reason</DialogTitle>
            <DialogDescription>Enter the title of the reason to add it to the list.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason title"
            value={newReasonTitle}
            onChange={e => setNewReasonTitle(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddReasonSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
