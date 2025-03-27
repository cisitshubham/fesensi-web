/* eslint-disable prettier/prettier */
import { ChannelStats, EntryCallout,EarningsChart,Highlights } from './blocks';

const Demo1LightSidebarContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-1 lg:gap-7.5 h-full items-stretch">
            <ChannelStats />
          </div>
        </div>

        <div className="lg:col-span-2">
				  <Highlights  />
        </div>
      </div>

    </div>
  );
};

export { Demo1LightSidebarContent };
