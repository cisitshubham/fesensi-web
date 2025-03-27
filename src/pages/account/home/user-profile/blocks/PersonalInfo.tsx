/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { fetchUser } from '../../../../../api/api'; // Ensure correct import
import { toAbsoluteUrl } from '@/utils';
import { KeenIcon } from '@/components';
import { CrudAvatarUpload } from '@/partials/crud';

const PersonalInfo = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData?.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Personal Info</h3>
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-28 text-gray-600 font-normal">Photo</td>
              <td className="py-2 text-gray700 font-normal min-w-32 text-2sm">
                150x150px JPEG, PNG Image
              </td>
              <td className="py-2 text-center">
                <div className="flex justify-center items-center">
                  <CrudAvatarUpload />
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Name</td>
              <td className="py-2 text-gray-800 font-normaltext-sm">{user?.first_name || 'N/A'}</td>
              <td className="py-2 text-center">
                {/* <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a> */}
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-600 font-normal">Email</td>
              <td className="py-3 text-gray-700 text-sm font-normal">{user?.email || 'N/A'}</td>
              <td className="py-3 text-center">
                {/* <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a> */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PersonalInfo };
