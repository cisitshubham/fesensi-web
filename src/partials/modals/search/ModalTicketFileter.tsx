import React, { useEffect, useState } from 'react';
import { KeenIcon } from '@/components';
import { Button } from '@/components/ui/button';
import { useViewport } from '@/hooks';
import { useLanguage } from '@/i18n';
import { getDropdown, TicketFilter } from '@/api/api'; // Assuming TicketFilter is an API function
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Projects2 } from '@/pages/public-profile/projects/3-columns/blocks';


	


interface IModalSearchProps {
	open: boolean;
	onOpenChange: () => void;
	onFilterApply: (data: any) => void;
}

const ModalTicketFilter: React.FC<IModalSearchProps> = ({ open, onOpenChange, onFilterApply }) => {
	const [viewportHeight] = useViewport();
	const { isRTL } = useLanguage();
	const offset = 500;
	const [categories, setCategories] = useState<{ title: string; selected: boolean }[]>([]);
	const [priorities, setPriorities] = useState<{ title: string; selected: boolean }[]>([]);
	const [statuses, setStatuses] = useState<{ title: string; selected: boolean }[]>([]);
	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date(2025, 0, 20),
		to: addDays(new Date(2025, 0, 20), 20)
	});
	
	useEffect(() => {
		const scrollToTop = () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		};
		if (open && viewportHeight) {
			scrollToTop();
		}
		return () => {
			scrollToTop();
		};
	}, [open, viewportHeight]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getDropdown();
				setCategories(response.data.categories || []);
				setPriorities(response.data.priorities || []);
				setStatuses(response.data.status || []);
			} catch (error) {
				console.error('Error fetching dropdown data:', error);
			}
		};
		fetchData();
	}, []);
	const toggleSelection = (setState: Function, index: number) => {
		setState((prevState: any[]) =>
			prevState.map((item, i) => ({
				...item,
				selected: i === index, 
			}))
		);
	};

	const handleReset = () => {
		setCategories(categories.map(item => ({...item, selected: false })));
        setPriorities(priorities.map(item => ({...item, selected: false })));
        setStatuses(statuses.map(item => ({...item, selected: false })));
		setDate({ from: new Date(), to: new Date() });
			
    };

	const prepareFilterData = () => {
		const selectedCategories = categories.filter(item => item.selected).map(item => (item as any)._id);
		const selectedPriorities = priorities.filter(item => item.selected).map(item => (item as any)._id);
		const selectedStatuses = statuses.filter(item => item.selected).map(item => (item as any).name);
		const startDate = format((date as any).from, 'yyyy-MM-dd');
		const endDate = format((date as any).to, 'yyyy-MM-dd');
		return {
			category: selectedCategories.join(','),
			priority: selectedPriorities.join(','),
			status: selectedStatuses.join(','),
			startDate: null, 
			endDate: null, 
		};
	};

	const sendFilterQuery = async () => {
		const filterData = prepareFilterData();
		const query = await TicketFilter(filterData)
		if (query) {
			
			onFilterApply(query);
            onOpenChange(); 
			handleReset(); 
        }
		
	
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg top-1/2 transform -translate-y-1/2">
				<DialogHeader className="text-center">
					<DialogTitle className="text-xl font-semibold text-gray-900">
						Filter Tickets
					</DialogTitle>
				</DialogHeader>

				<div className="max-h-[60vh] overflow-y-auto px-2 gap-2 mb-3">
					<div className="flex mb-3 mt-2 gap-2">
						<Popover>
							<PopoverTrigger asChild>
								<button
									id="date"
									className={cn(
										'btn btn-sm btn-light data-[state=open]:bg-light-active',
										!date && 'text-gray-400'
									)}
								>
									<KeenIcon icon="calendar" className="me-0.5" />
									{date?.from ? (
										date.to ? (
											<>
												{format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
											</>
										) : (
											format(date.from, 'LLL dd, y')
										)
									) : (
										<span>Pick a date range</span>
									)}
								</button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="end">
								<Calendar
									initialFocus
									mode="range"
									defaultMonth={date?.from}
									selected={date}
									onSelect={setDate}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
						<Button
							onClick={handleReset}
							className="btn btn-tabs ml-auto text-gray-700 bg-transparent hover:bg-gray-200 border border-gray-300"
						>
							<KeenIcon icon="filter" className="text-gray-500" /> Reset All
						</Button>
					</div>

					{[
						{ label: 'Categories', data: categories, setState: setCategories },
						{ label: 'Priorities', data: priorities, setState: setPriorities },
						{ label: 'Statuses', data: statuses, setState: setStatuses },
					].map(({ label, data, setState }) => (
						<div key={label} className="bg-gray-100 p-4 rounded-lg shadow-sm  mb-3">
							<div className="flex items-center justify-between mb-3">
								<h4 className="text-lg font-medium text-gray-900">{label}</h4>
								<KeenIcon icon="filter-edit" className="text-gray-500" />
							</div>
							<div className="grid grid-cols-2 gap-2 mb-3">
								{data.map((item, index) => (
									<button
										key={index}
										onClick={() => toggleSelection(setState, index)}
										className={`px-3 py-2 text-sm font-medium rounded-lg border ${item.selected
												? 'bg-primary text-white'
												: ' text-gray-700 border-gray-300'
											}`}
									>
										{(item as any).name || item.title}
									</button>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="p-4 border-t  sticky bottom-0 left-0 w-full">
					<button
						onClick={sendFilterQuery}
						className="w-full px-4 py-2 text-lg  text-white bg-primary rounded-lg hover:bg-primary-dark transition"
					>
						Apply Filters
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);

	
};

export { ModalTicketFilter };
