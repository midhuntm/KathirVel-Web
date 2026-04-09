import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import LoginModal from './components/LoginModal';
import LogoutModal from './components/LogoutModal';
import DataOverview from './components/DataOverview';
import UserDetail from './components/UserDetail';
import OrderDetail from './components/OrderDetail';
import Footer from './components/Footer';
import { createUser, fetchOrnaments, fetchUsers, inviteAdmin, loginUser, createOrnament } from './services/api';
import { buildOrders } from './utils/orders';
import './App.css';

function App() {
  const [ornaments, setOrnaments] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('vetrivel_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const orders = buildOrders(users, ornaments);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const [ornamentData, userData] = await Promise.all([
          fetchOrnaments(),
          fetchUsers(),
        ]);

        setOrnaments(ornamentData);
        setUsers(userData);
      } catch (error) {
        setLoadError(error.message || 'Unable to load backend data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogin = async (credentials) => {
    const response = await loginUser(credentials);
    setCurrentUser(response.user);
    if (response.token) localStorage.setItem('vetrivel_token', response.token);
    localStorage.setItem('vetrivel_user', JSON.stringify(response.user));
    setIsLoginOpen(false);
    return response;
  };

  const handleRegister = async (payload) => {
    const response = await createUser(payload);
    setUsers((current) => [...current, response.item]);
    setCurrentUser(response.item);
    if (response.token) localStorage.setItem('vetrivel_token', response.token);
    localStorage.setItem('vetrivel_user', JSON.stringify(response.item));
    setIsLoginOpen(false);
    return response;
  };

  const handleInviteAdmin = async (payload) => {
    const response = await inviteAdmin(payload);
    return response;
  };

  const handleCreateOrnament = async (payload) => {
    const response = await createOrnament(payload);
    setOrnaments((current) => [...current, response.item]);
    return response;
  };

  const handleNavigateToUser = (user) => {
    if (user) {
      setSelectedOrder(null);
      setSelectedUser(user);
      setCurrentView('user_detail');
    }
  };

  const handleNavigateToOrder = (order) => {
    if (order) {
      setSelectedUser(null);
      setSelectedOrder(order);
      setCurrentView('order_detail');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    setIsLogoutOpen(false);
    localStorage.removeItem('vetrivel_user');
    localStorage.removeItem('vetrivel_token');
  };

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={() => setIsLogoutOpen(true)}
        onNavigate={(view) => setCurrentView(view)}
      />
      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <ProductGrid
              products={ornaments}
              isLoading={isLoading}
              error={loadError}
            />
          </>
        )}
        
        {currentView === 'admin' && currentUser?.role?.toLowerCase() === 'admin' && (
          <DataOverview
            ornaments={ornaments}
            users={users}
            currentUser={currentUser}
            isLoading={isLoading}
            error={loadError}
            onInviteAdmin={handleInviteAdmin}
            onCreateOrnament={handleCreateOrnament}
            orders={orders}
            onNavigateToUser={handleNavigateToUser}
            onNavigateToOrder={handleNavigateToOrder}
          />
        )}

        {currentView === 'user_detail' && selectedUser && (
          <UserDetail 
            user={selectedUser} 
            orders={orders}
            onBack={() => {
              setSelectedUser(null);
              setCurrentView('admin');
            }}
          />
        )}

        {currentView === 'order_detail' && selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onBack={() => {
              setSelectedOrder(null);
              setCurrentView('admin');
            }}
          />
        )}
      </main>
      <Footer />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
