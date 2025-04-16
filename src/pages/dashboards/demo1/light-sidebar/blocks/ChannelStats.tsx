/* eslint-disable prettier/prettier */
import { useEffect, useState, Fragment } from 'react';
import { dashaboardTicket } from '../../../../../api/api';
import { Link, useNavigate } from 'react-router-dom';

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

const ChannelStats = (date?:any) => {
	const [items, setItems] = useState<IChannelStatsItem[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const response = await dashaboardTicket();
				if (response?.data && Array.isArray(response.data)) {
					const mappedItems: IChannelStatsItem[] = response.data.map((item:any) => ({
						logo: item.icon, 
						info: item.count.toLocaleString(),
						desc: statusMapping[item.status] || item.status,
						path: '/TicketFilter/', 
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
			{items.length === 0 ? (
				<div className="text-center text-gray-500 py-4">No data available</div>
			) : (
				items.map((item, index) => (
					item.info === "0" ? (
						<div key={index} className="card flex-col justify-between gap-5 h-full bg-cover bg-no-repeat channel-stats-bg transition hover:shadow-lg active:scale-95 cursor-default" >
							<div className="flex flex-col items-center text-center p-4">
								<div className="flex items-center gap-10">
									<img src={item.logo} className="w-10 h-10" alt={item.desc} />
									<span className="text-sm font-medium text-gray-700">{item.desc}</span>
								</div>
								<span className="text-3xl font-semibold text-gray-900 mt-2">{item.info}</span>
							</div>
						</div>
					) : (
						<Link
							to={`/TicketFilter/${encodeURIComponent(item.desc)}`}
							key={index}
							className="card flex-col justify-between gap-5 h-full bg-cover bg-no-repeat channel-stats-bg transition hover:shadow-lg active:scale-95"
						>
							<button
								className="card flex-col justify-between gap-5 h-full bg-cover bg-no-repeat channel-stats-bg transition hover:shadow-lg active:scale-95 w-full"
								>
								<div className="flex flex-col items-center text-center p-4">
									<div className="flex items-center gap-10">
										<img src={item.logo} className="w-10 h-10" alt={item.desc} />
										<span className="text-sm font-medium text-gray-700">{item.desc}</span>
									</div>
									<span className="text-3xl font-semibold text-gray-900 mt-2">{item.info}</span>
								</div>
							</button>
						</Link>
					)
				))
			)}
		</Fragment>


	);
};

export { ChannelStats };
