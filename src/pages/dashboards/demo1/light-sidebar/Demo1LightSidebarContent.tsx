/* eslint-disable prettier/prettier */
import { ChannelStats, EntryCallout,EarningsChart,Highlights } from './blocks';

const Demo1LightSidebarContent = (date?:any) => {
	
	
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-1 lg:gap-7.5 h-full items-stretch">
            <ChannelStats  date={date}/>
          </div>
        </div>

        <div className="lg:col-span-2">
		   <Highlights  date={date}/>
        </div>
      </div>

    </div>
  );
};

export { Demo1LightSidebarContent };
