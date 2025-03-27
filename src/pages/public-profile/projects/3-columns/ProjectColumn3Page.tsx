/* eslint-disable prettier/prettier */
import { Fragment } from 'react';
import { Container } from '@/components/container';
import { toAbsoluteUrl } from '@/utils/Assets';

import { UserProfileHero } from '@/partials/heros';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { PageMenu } from '@/pages/public-profile';
import { Projects2 } from './blocks';
import { Link } from 'react-router-dom';


const ProjectColumn3Page = () => {
 
  return (
    <Fragment>
      <Container>
        <Navbar>
          <PageMenu />
          <NavbarActions>
			<Link to="/public-profile/projects/createTickets" className="btn btn-sm btn-primary">Create Ticket</Link>
          </NavbarActions>
        </Navbar>
      </Container>
      <Container>
        <Projects2 />
      </Container>
    </Fragment>
  );
};

export { ProjectColumn3Page };
