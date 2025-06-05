'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useMasterDropdown } from './master-dropdown-context';
import { MasterDropdownDatatype } from '@/types';
import { KeenIcon } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export type Filters = {
  status: string[];
  priority: string[];
  category: string[];

  startDate: string;
  endDate: string;
};

interface SearchbarFiltersProps {
  onFiltersChange: (filters: Filters) => void;
}

export default function SearchbarFilters({ onFiltersChange }: SearchbarFiltersProps) {
  // Correct the variable name and ensure proper typing
  const { dropdownData, loading } = useMasterDropdown();
  const [categories, setCategories] = useState<MasterDropdownDatatype['categories']>([]);
  const [priorities, setPriorities] = useState<MasterDropdownDatatype['priorities']>([]);
  const [statuses, setStatuses] = useState<MasterDropdownDatatype['status']>([]);
  const [filters, setFilters] = useState<{
    status: string[];
    priority: string[];
    category: string[];
    startDate: string;
    endDate: string;
  }>({
    status: [],
    priority: [],
    category: [],
    startDate: '',
    endDate: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatedToday, setIsCreatedToday] = useState(false);

  // Update state when dropdownData changes
  useEffect(() => {
    if (dropdownData) {
      setCategories(dropdownData.categories || []);
      setPriorities(dropdownData.priorities || []);
      setStatuses(dropdownData.status || []);
    }
  }, [dropdownData]);

  const handleCheckboxChange = (filterType: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      if (filterType === 'startDate' && value === 'createdToday') {
        const today = new Date().toISOString().split('T')[0];
        const newIsCreatedToday = !isCreatedToday;
        setIsCreatedToday(newIsCreatedToday);
        const updatedFilters = {
          ...prev,
          startDate: newIsCreatedToday ? today : '',
          endDate: newIsCreatedToday ? today : ''
        };
        const transformedFilters: Filters = {
          status: updatedFilters.status,
          priority: updatedFilters.priority,
          category: updatedFilters.category,
          startDate: updatedFilters.startDate,
          endDate: updatedFilters.endDate
        };
        onFiltersChange(transformedFilters);
        return updatedFilters;
      }

      if (Array.isArray(prev[filterType])) {
        const updated = (prev[filterType] as string[]).includes(value)
          ? (prev[filterType] as string[]).filter((item) => item !== value)
          : [...(prev[filterType] as string[]), value];
        const updatedFilters = { ...prev, [filterType]: updated };
        const transformedFilters: Filters = {
          status: updatedFilters.status,
          priority: updatedFilters.priority,
          category: updatedFilters.category,
          startDate: updatedFilters.startDate,
          endDate: updatedFilters.endDate
        };
        onFiltersChange(transformedFilters);
        return updatedFilters;
      }

      return prev;
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [field]: value
      };
      setIsCreatedToday(false);
      console.log('Date changed:', { field, value, updatedFilters });
      const transformedFilters: Filters = {
        status: updatedFilters.status,
        priority: updatedFilters.priority,
        category: updatedFilters.category,
        startDate: updatedFilters.startDate,
        endDate: updatedFilters.endDate
      };
      onFiltersChange(transformedFilters);
      return updatedFilters;
    });
  };

  // Count total active filters
  const activeFiltersCount =
    filters.status.length +
    filters.priority.length +
    filters.category.length +
    (isCreatedToday ? 1 : 0) +
    (filters.startDate && !isCreatedToday ? 1 : 0) +
    (filters.endDate && !isCreatedToday ? 1 : 0);

  const clearAllFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      startDate: '',
      endDate: ''
    });
    setIsCreatedToday(false);
    const transformedFilters: Filters = {
      status: [],
      priority: [],
      category: [],
      startDate: '',
      endDate: ''
    };
    onFiltersChange(transformedFilters);
  };

  const handleApplyFilters = () => {
    const transformedFilters: Filters = {
      status: filters.status,
      priority: filters.priority,
      category: filters.category,

      startDate: filters.startDate,
      endDate: filters.endDate
    };
console.log(transformedFilters)
    onFiltersChange(transformedFilters);
    setIsModalOpen(false);
  };
  return (
    <div className="flex flex-col space-y-6 ">
      <div className="max-w-xl" id="container">
        <div className="flex flex-row justify-between items-center gap-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" disabled={loading}>
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 px-1.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-fit p-6">
              <DialogHeader>
                <DialogTitle>Filter Options</DialogTitle>
              </DialogHeader>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="flex flex-row gap-6 py-4">
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Status</h4>
                    <div className="space-y-2">
                      {statuses.map((status) => (
                        <div key={status._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status._id}`}
                            checked={filters.status.includes(status.name)}
                            onCheckedChange={() => handleCheckboxChange('status', status.name)}
                          />
                          <label
                            htmlFor={`status-${status._id}`}
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {status.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator orientation="vertical" />

                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Priority</h4>
                    <div className="space-y-2">
                      {priorities.map((priority) => (
                        <div key={priority._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority._id}`}
                            checked={filters.priority.includes(priority._id)}
                            onCheckedChange={() => handleCheckboxChange('priority', priority._id)}
                          />
                          <label
                            htmlFor={`priority-${priority._id}`}
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {priority.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category._id}`}
                            checked={filters.category.includes(category._id)}
                            onCheckedChange={() => handleCheckboxChange('category', category._id)}
                          />
                          <label
                            htmlFor={`category-${category._id}`}
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Date</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="date-created-today"
                          checked={isCreatedToday}
                          onCheckedChange={() => handleCheckboxChange('startDate', 'createdToday')}
                        />
                        <label
                          htmlFor="date-created-today"
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Created Today
                        </label>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-normal leading-none">From</label>
                        <Input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => handleDateChange('startDate', e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-normal leading-none">To</label>
                        <Input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => handleDateChange('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex items-center justify-between border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  disabled={activeFiltersCount === 0}
                >
                  Clear all
                </Button>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button size="sm" onClick={handleApplyFilters}>
                    Apply filters
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status.map((status) => {
            const statusTitle = statuses.find((s) => s.name === status)?.name || status;
            return (
              <Badge
                key={`badge-status-${status}`}
                variant="outline"
                className="flex items-center gap-1"
              >
                {statusTitle}
                <button
                  className="ml-1 hover:bg-muted rounded-full"
                  onClick={() => handleCheckboxChange('status', status)}
                >
                  <span className="sr-only">Remove</span>
                  <KeenIcon icon="cross" />
                </button>
              </Badge>
            );
          })}
          {filters.priority.map((priority) => {
            const priorityTitle = priorities.find((p) => p._id === priority)?.name || priority;
            return (
              <Badge
                key={`badge-priority-${priority}`}
                variant="outline"
                className="flex items-center gap-1"
              >
                {priorityTitle}
                <button
                  className="ml-1 hover:bg-muted rounded-full"
                  onClick={() => handleCheckboxChange('priority', priority)}
                >
                  <span className="sr-only">Remove</span>
                  <KeenIcon icon="cross" />
                </button>
              </Badge>
            );
          })}
          {filters.category.map((category) => {
            const categoryTitle = categories.find((c) => c._id === category)?.title || category;
            return (
              <Badge
                key={`badge-category-${category}`}
                variant="outline"
                className="flex items-center gap-1"
              >
                {categoryTitle}
                <button
                  className="ml-1 hover:bg-muted rounded-full"
                  onClick={() => handleCheckboxChange('category', category)}
                >
                  <span className="sr-only">Remove</span>
                  <KeenIcon icon="cross" />
                </button>
              </Badge>
            );
          })}
          {isCreatedToday && (
            <Badge
              key="badge-date-created-today"
              variant="outline"
              className="flex items-center gap-1"
            >
              Created Today
              <button
                className="ml-1 hover:bg-muted rounded-full"
                onClick={() => handleCheckboxChange('startDate', 'createdToday')}
              >
                <span className="sr-only">Remove</span>
                <KeenIcon icon="cross" />
              </button>
            </Badge>
          )}
          {(filters.startDate || filters.endDate) && !isCreatedToday && (
            <Badge
              key="badge-date-range"
              variant="outline"
              className="flex items-center gap-1"
            >
              {`${filters.startDate ? new Date(filters.startDate).toLocaleDateString() : 'Start'} - ${filters.endDate ? new Date(filters.endDate).toLocaleDateString() : 'End'}`}
              <button
                className="ml-1 hover:bg-muted rounded-full"
                onClick={() => {
                  handleDateChange('startDate', '');
                  handleDateChange('endDate', '');
                }}
              >
                <span className="sr-only">Remove</span>
                <KeenIcon icon="cross" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
