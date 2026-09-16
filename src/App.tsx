import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlogPage } from './pages/BlogPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <main className="min-h-[70vh]">
      {activeView === 'home' && <HomePage />}
      {activeView === 'products' && <ProductsPage />}
      {activeView === 'checkout' && <CheckoutPage />}
      {activeView === 'blog' && <BlogPage />}
      {activeView === 'orders' && <OrdersPage />}
      {activeView === 'admin' && <AdminPage />}
    </main>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Hind_Siliguri',sans-serif]">
            <Header />
            <div className="flex-1">
              <MainContent />
            </div>
            <Footer />
            <CartDrawer />
          </div>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
