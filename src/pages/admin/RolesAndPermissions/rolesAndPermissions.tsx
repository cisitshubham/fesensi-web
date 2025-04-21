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

export default function  rolesAndPermissions  () {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />
    <div className="px-8">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle>Roles and RolesAndPermissions</CardTitle>
          <Button>Add</Button>
        </CardHeader>


      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Overview of all team members and roles.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                View Roles
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <AccountPermissionsCheckContent />
      </Container>
    </Fragment>
  );
};

