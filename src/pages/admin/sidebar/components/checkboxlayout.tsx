
import { IHighlightedPostsItems } from '@/partials/misc';
import PermissionsCheck from './roles';

const AccountPermissionsCheckContent = () => {
  const posts: IHighlightedPostsItems = [
    {
      icon: 'security-user',
      title: 'Optimizing Team Coordination: Role Assignment Tools',
      summary:
        'Empower your team with dynamic role assignment capabilities. Utilize our intuitive tools to assign and manage user permissions effectively. Explore resources and best practices to maximize team efficiency.',
      path: '#'
    },
    {
      icon: 'toggle-on-circle',
      title: 'Refining Access Control: Permissions Customization',
      summary:
        "Tailor user experiences with customizable permission settings. Our detailed guides and resources provide streamlined processes for managing access levels. Ensure secure and precise control over your workspace's functionalities.",
      path: '#'
    },
    {
      icon: 'shield-tick',
      title: 'Enhanced Security Management: Granular Permission Settings',
      summary:
        'Fortify your workspace with enhanced permission controls. Our advanced settings allow for granular access management, ensuring each team member has the appropriate level of access. Benefit from our comprehensive security protocols and guidance.',
      path: '#'
    }
  ];

  return (
    <div className=" gap-5 lg:gap-7.5">
      <div className="col-span-2">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <PermissionsCheck />
        </div>
      </div>
    </div>
  );
};

export { AccountPermissionsCheckContent };
