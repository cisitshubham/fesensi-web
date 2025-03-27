/* eslint-disable prettier/prettier */
import { useEffect, useState, Fragment } from 'react';
import { dashaboardTicket } from '../../../../../api/api';

interface IChannelStatsItem {
	logo: string;
	info: string;
	desc: string;
	path: string;
}

const statusMapping: Record<string, string> = {
	OPEN: 'OPEN',
	'IN-PROGRESS': 'IN-PROGRESS',
	RESOLVED: 'RESOLVED',
	CLOSED: 'CLOSED',
};

const ChannelStats = () => {
	const [items, setItems] = useState<IChannelStatsItem[]>([]);

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const response = await dashaboardTicket(); // Fetch data from API
				if (response?.data && Array.isArray(response.data)) {
					console.log(response.data);

					const mappedItems: IChannelStatsItem[] = response.data.map((item:any) => ({
						logo: item.icon, 
						info: item.count.toLocaleString(),
						desc: statusMapping[item.status] || item.status,
						path: '', // Keep empty path if not required
					}));

					setItems(mappedItems);
				}
			} catch (error) {
				console.error('Error fetching ticket data:', error);
			}
		};

		fetchTickets();
	}, []);

	return (
		<Fragment>
			{items.map((item, index) => (
				<div key={index} className="card flex-col justify-between gap-5 h-full bg-cover bg-no-repeat channel-stats-bg">
					<div className="flex flex-col items-center text-center p-4">
						{/* Icon and Text */}
						<div className="flex items-center gap-2">
							<img src={item.logo} className="w-10 h-10" alt={item.desc} />
							<span className="text-sm font-medium text-gray-700">{item.desc}</span>
						</div>

						{/* Number Info */}
						<span className="text-3xl font-semibold text-gray-900 mt-2">{item.info}</span>
					</div>

				</div>
			))}
		</Fragment>
	);
};

export { ChannelStats };
