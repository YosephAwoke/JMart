import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProviders } from '../providers/AppProviders';
import { Navbar } from '../components/Navbar';
import { BackdropOrbits } from '../components/BackdropOrbits';
import { CartDrawer } from '../components/CartDrawer';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ReceiptPage } from '../pages/ReceiptPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AccountPage from '../pages/AccountPage';
import FavoritesPage from '../pages/FavoritesPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

export function AppShell() {
  return (
    <AppProviders>
      <BrowserRouter>
        <div className="relative min-h-screen bg-transparent">
          <BackdropOrbits />
          <Navbar />
          <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<ReceiptPage />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <CartDrawer />
        </div>
      </BrowserRouter>
    </AppProviders>
  );
}