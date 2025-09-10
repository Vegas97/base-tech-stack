'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ValidTenantId } from '@/../convex/lib/constants';

interface TenantContextType {
  tenantId: ValidTenantId;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  tenantId: ValidTenantId;
}

export function TenantProvider({ children, tenantId }: TenantProviderProps) {
  return (
    <TenantContext.Provider value={{ tenantId }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
