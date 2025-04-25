import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetMasterDropdown } from '@/api/api';
interface MasterDropdownContextType {
  dropdownData: any;
  loading: boolean;
  error: string | null;
  refreshDropdownData: () => void;
}

const MasterDropdownContext = createContext<MasterDropdownContextType | undefined>(undefined);

export const MasterDropdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }): React.ReactElement => {
  const [dropdownData, setDropdownData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDropdownData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetMasterDropdown();
      setDropdownData(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dropdown data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  return (
    <MasterDropdownContext.Provider
      value={{
        dropdownData,
        loading,
        error,
        refreshDropdownData: fetchDropdownData,
      }}
    >
      {children}
    </MasterDropdownContext.Provider>
  );
};

export const useMasterDropdown = (): MasterDropdownContextType => {
  const context = useContext(MasterDropdownContext);
  if (!context) {
    throw new Error('useMasterDropdown must be used within a MasterDropdownProvider');
  }
  return context;
};
