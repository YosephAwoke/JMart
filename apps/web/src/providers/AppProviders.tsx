import { ReactNode } from 'react';
import { CartProvider } from './CartProvider';
import { LocaleProvider } from './LocaleProvider';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <CartProvider>{children}</CartProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}