import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Container, MenuLabel } from '@/components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { KeenIcon } from '@/components';



const ViewTicket = () => {
	
	return (
		<Container>
			<Navbar>
			<MenuLabel className='cursor-default'>Ticket Details</MenuLabel>
			</Navbar>
			<div className="card max-w-full w-full">
				<div className="card-body p-5 py-3 gap-5 ">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Title</MenuLabel>
					<Input className='' readOnly value={'hello'} />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Description</MenuLabel>
					<Textarea className='resize-none outline-info-inverse ' value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sagittis, turpis id gravida consectetur, ipsum risus dictum ex, non tempor erat nunc eu turpis. Donec finibus, mauris vel ornare auctor, eros dui tempus turpis, a vulputate nunc erat vel mi." readOnly />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Category</MenuLabel>
					<Input className='' readOnly value={'hello'} />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Priroty</MenuLabel>
					<Input className='' readOnly value={'hello'} />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Attachments</MenuLabel>
					<div className="flex gap-3 hover:text-primary-active">
						<Link to="/attachment/123456" className=''>
						<KeenIcon icon="files" className="w-6 h-6 text-gray-700" />
						 image.png
						</Link>
                    </div>
				</div>
			</div>
			

			<div className="card max-w-full w-full mt-3">
				<div className="card-body p-5 py-3 gap-5 ">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Title</MenuLabel>
					<Input className='' readOnly value={'hello'} />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Description</MenuLabel>
					<Textarea className='resize-none outline-info-inverse ' value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sagittis, turpis id gravida consectetur, ipsum risus dictum ex, non tempor erat nunc eu turpis. Donec finibus, mauris vel ornare auctor, eros dui tempus turpis, a vulputate nunc erat vel mi." readOnly />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Category</MenuLabel>
					<Input className='' readOnly value={'hello'} />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Priroty</MenuLabel>
					<Input className='' readOnly value={'hello'} />
				</div>
				<div className="card-body p-5 py-3 gap-5">
					<MenuLabel className="mb-2 text-gray-700 text-2sm cursor-default">Attachments</MenuLabel>
					<div className="flex gap-3 hover:text-primary-active">
						<Link to="/attachment/123456" className=''>
						<KeenIcon icon="files" className="w-6 h-6 text-gray-700" />
						 image.png
						</Link>
                    </div>
				</div>
			</div>
		</Container>
	);
};

export default ViewTicket;
