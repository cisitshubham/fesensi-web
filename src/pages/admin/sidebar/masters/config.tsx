import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface IPermissionsToggleItem {
  title: string;
  description: string;
  checked: boolean;
}

export default function PermissionsToggle() {
  const initialItems: IPermissionsToggleItem[] = [
    { title: 'Workspace Settings', description: 'Users may view and update the settings of the workspace.', checked: true },
    { title: 'Billing Management', description: 'Users are authorized to review, update subscriptions.', checked: false },
    { title: 'Integration Setup', description: 'Manage user integrations and associated tags.', checked: true },
    { title: 'Permissions Control', description: 'Grant or revoke user access and tags.', checked: false },
    { title: 'Map Creation', description: 'Initiate new mapping projects within workspace.', checked: false },
    { title: 'Data Export', description: 'Allow extraction of workspace data for analysis.', checked: true },
    { title: 'User Roles', description: 'Update roles and permissions for map users.', checked: true },
    { title: 'Security Settings', description: 'Adjust workspace security protocols and measures.', checked: true },
    { title: 'Insights Access', description: 'View workspace analytics and performance data.', checked: false },
    { title: 'Merchant List', description: 'Update and manage merchant associations.', checked: false }

  ];

  const [items, setItems] = useState<IPermissionsToggleItem[]>(initialItems);

  const handleToggle = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
  };

  const handleReset = () => {
    setItems(initialItems);
  };

  const handleSave = () => {
    alert('Changes saved!');
  };

  const renderItem = (item: IPermissionsToggleItem, index: number) => (
    <div key={index} className="rounded-xl border p-4 flex items-center justify-between gap-2.5">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
          {item.title}
        </span>
        <span className="text-2sm text-gray-700">{item.description}</span>
      </div>
      <div className="switch switch-sm">
        <input
          checked={item.checked}
          name="param"
          type="checkbox"
          value={index}
          onChange={() => handleToggle(index)}
        />
        <input defaultChecked={item.checked} name="param" type="checkbox" value={index} readOnly />

      </div>
    </div>
  );

  return (
    <Card className="mx-8">
      <CardHeader className="">
        <CardTitle className="card-title">
          Configuration
         
        </CardTitle>
      </CardHeader>
      <CardContent className="card-body grid grid-cols-1 lg:grid-cols-2 gap-5 py-5 lg:py-7.5">
        {items.map(renderItem)}
      </CardContent>
      <CardFooter className="card-footer flex justify-end gap-3">
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </CardFooter>
    </Card>
  );
}
