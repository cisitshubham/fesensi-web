import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type RoleContextType = {
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(() => {
    // Initialize from localStorage if available
    const savedRoles = localStorage.getItem('selectedRoles');
    return savedRoles ? JSON.parse(savedRoles) : [];
  });

  // Save to localStorage whenever selectedRoles changes
  useEffect(() => {
    localStorage.setItem('selectedRoles', JSON.stringify(selectedRoles));
  }, [selectedRoles]);

  return (
    <RoleContext.Provider value={{ selectedRoles, setSelectedRoles }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
