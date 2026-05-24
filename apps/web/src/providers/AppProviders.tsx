import { ReactNode } from 'react';
import { CartProvider } from './CartProvider';
import { LocaleProvider } from './LocaleProvider';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}