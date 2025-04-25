import { createContext, useContext, useState, ReactNode } from 'react';

type RoleContextType = {
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  return (
    <RoleContext.Provider value={{ selectedRoles, setSelectedRoles }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
};
