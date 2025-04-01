import { RecentUploads } from '@/pages/public-profile/profiles/default';
import { PersonalInfo, CalendarAccounts } from './blocks';

const AccountUserProfileContent = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
      <div className="col-span-2">
        <div className="grid gap-5 lg:gap-7.5">
          <PersonalInfo />
          {/* <CalendarAccounts /> */}
        </div>
      </div>
    </div>
  );
};

export { AccountUserProfileContent };
