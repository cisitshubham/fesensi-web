import { getEscalatedTickets } from '@/api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import Ticket from './ecalatedTicket';
import { NoTicketsPage } from '@/errors/no-ticketspage';
import { EscalatedTicketData, MasterDropdownDatatype } from '@/types';
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from '@/components/ui/checkbox';

interface Filters {
    category: string[];
    priority: string[];
}

export default function EscalatedAgent() {
    const { dropdownData, loading: dropdownLoading } = useMasterDropdown();
    const [escalatedTickets, setEscalatedTickets] = useState<EscalatedTicketData[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<EscalatedTicketData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        category: [],
        priority: []
    });

    useEffect(() => {
        const fetchEscalatedTickets = async () => {
            try {
                const formData = new FormData();
                if (filters.category.length) {
                    filters.category.forEach(cat => {
                        formData.append('category[]', cat);
                    });
                }
                if (filters.priority.length) {
                    filters.priority.forEach(pri => {
                        formData.append('priority[]', pri);
                    });
                }
                const response = await getEscalatedTickets(formData);
                const tickets = Array.isArray(response.data) ? response.data : [];
                setEscalatedTickets(tickets);
                setFilteredTickets(tickets);
                setIsLoading(false);
            } catch (error: any) {
                console.error('Error fetching escalated tickets:', error);
                setEscalatedTickets([]);
                setFilteredTickets([]);
                setIsLoading(false);
            }
        };
        fetchEscalatedTickets();
    }, [filters]);

    const handleCheckboxChange = (filterType: keyof Filters, value: string) => {
        setFilters(prev => {
            const updated = prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value];
            return { ...prev, [filterType]: updated };
        });
    };

    const clearAllFilters = () => {
        setFilters({
            category: [],
            priority: []
        });
    };

    // Count total active filters
    const activeFiltersCount = filters.category.length + filters.priority.length;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px] text-muted-foreground">
                Loading tickets...
            </div>
        );
    }

    return (
        <div className="mx-8 space-y-4">
            <div className="flex flex-col space-y-6">
                <div className="max-w-xl">
                    <div className="flex flex-row justify-between items-center gap-4">
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2" disabled={dropdownLoading}>
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

                                {dropdownLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : (
                                    <div className="flex flex-row gap-6 py-4">
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-sm">Priority</h4>
                                            <div className="space-y-2">
                                                {dropdownData?.priorities.map((priority: MasterDropdownDatatype['priorities'][0]) => (
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
                                                {dropdownData?.categories.map((category: MasterDropdownDatatype['categories'][0]) => (
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
                                    <DialogClose asChild>
                                        <Button variant='default' size="sm">
                                            Apply
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Active filters display */}
                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {filters.priority.map((priority) => {
                            const priorityTitle = dropdownData?.priorities.find((p: MasterDropdownDatatype['priorities'][0]) => p._id === priority)?.name || priority;
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
                            const categoryTitle = dropdownData?.categories.find((c: MasterDropdownDatatype['categories'][0]) => c._id === category)?.title || category;
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
                    </div>
                )}
            </div>

            {filteredTickets.length === 0 ? (
                <NoTicketsPage />
            ) : (
                <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                        <Ticket key={ticket._id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
}