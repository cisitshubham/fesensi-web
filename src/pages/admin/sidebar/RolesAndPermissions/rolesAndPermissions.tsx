import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
	Toolbar,
	ToolbarActions,
	ToolbarDescription,
	ToolbarHeading,
	ToolbarPageTitle
} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { AccountPermissionsCheckContent } from '../components/checkboxlayout';
import { useLayout } from '@/providers';

export default function rolesAndPermissions() {
	const { currentLayout } = useLayout();

	return (
		<Fragment>
			<PageNavbar />

			{currentLayout?.name === 'demo1-layout' && (
				<Container>
					<Toolbar>
						<ToolbarHeading>
							<ToolbarPageTitle />
							<ToolbarDescription>Overview of all team members and roles.</ToolbarDescription>
						</ToolbarHeading>
			
					</Toolbar>
				</Container>
			)}

			<Container>
				<AccountPermissionsCheckContent />
			</Container>
		</Fragment>
	);
};