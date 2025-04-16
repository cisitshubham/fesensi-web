/* eslint-disable prettier/prettier */
import { Fragment } from 'react';
import { Accordion,AccordionItem } from '@/components/accordion';
import { toAbsoluteUrl } from '@/utils/Assets';
import { Container, MenuLabel } from '@/components';

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
		<MenuLabel className='cursor-default mb-3'>Ticket Details</MenuLabel>
        <NavbarActions>
			<Link to="/public-profile/projects/createTickets" className='btn btn-primary btn-xs m-0 mb-0'>Create Ticket</Link>
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
