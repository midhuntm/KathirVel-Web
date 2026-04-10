import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logoutUser } from './store/userSlice';

import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import LogoutModal from './components/LogoutModal';
import Footer from './components/Footer';
import UserDetail from './components/UserDetail';
import OrderDetail from './components/OrderDetail';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

import { createUser, fetchOrnaments, fetchUsers, inviteAdmin, loginUser, createOrnament } from './services/api';
import { buildOrders } from './utils/orders';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [ornaments, setOrnaments] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  
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
    dispatch(setUser({ user: response.user, token: response.token }));
    setIsLoginOpen(false);
    return response;
  };

  const handleRegister = async (payload) => {
    const response = await createUser(payload);
    setUsers((current) => [...current, response.item]);
    dispatch(setUser({ user: response.item, token: response.token }));
    setIsLoginOpen(false);
    return response;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsLogoutOpen(false);
    navigate('/');
  };

  const handleNavigate = (view) => {
    if (view === 'home' || view === 'Home') navigate('/');
    if (view === 'admin' || view === 'Admin') navigate('/admin');
    if (view === 'shop' || view === 'Shop') navigate('/shop');
    if (view === 'cart' || view === 'Cart') navigate('/cart');
  };

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={() => setIsLogoutOpen(true)}
        onNavigate={handleNavigate}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home ornaments={ornaments} isLoading={isLoading} error={loadError} />} />
          <Route path="/shop" element={<Shop ornaments={ornaments} isLoading={isLoading} error={loadError} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/*" element={
            <AdminDashboard 
              ornaments={ornaments} 
              users={users} 
              currentUser={currentUser} 
              isLoading={isLoading} 
              error={loadError} 
              onInviteAdmin={inviteAdmin} 
              onCreateOrnament={async (p) => {
                const res = await createOrnament(p);
                setOrnaments(curr => [...curr, res.item]);
                return res;
              }} 
              orders={orders} 
            />
          } />
          {/* Temporary inline routes for legacy detail components */}
          <Route path="/admin/user/:id" element={
             <UserDetailWrapper users={users} orders={orders} onBack={() => navigate('/admin')} />
          } />
          <Route path="/admin/order/:id" element={
             <OrderDetailWrapper orders={orders} onBack={() => navigate('/admin')} />
          } />
        </Routes>
      </main>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} onRegister={handleRegister} />
      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onLogout={handleLogout} />
    </div>
  );
}

import { useParams } from 'react-router-dom';
function UserDetailWrapper({ users, orders, onBack }) {
    const { id } = useParams();
    const user = users.find(u => u.id === id);
    if (!user) return <div style={{padding:'8rem', textAlign:'center'}}>User not found</div>;
    return <UserDetail user={user} orders={orders} onBack={onBack} />;
}
function OrderDetailWrapper({ orders, onBack }) {
    const { id } = useParams();
    const order = orders.find(o => o.tracker_id === id);
    if (!order) return <div style={{padding:'8rem', textAlign:'center'}}>Order not found</div>;
    return <OrderDetail order={order} onBack={onBack} />;
}

export default App;
