import React, { useState } from 'react';
import DataOverview from '../components/DataOverview';
import UserDetail from '../components/UserDetail';
import OrderDetail from '../components/OrderDetail';
import { Routes, Route, useNavigate } from 'react-router-dom';

function AdminDashboard({ 
    ornaments, 
    users, 
    currentUser, 
    isLoading, 
    error, 
    onInviteAdmin, 
    onCreateOrnament, 
    orders 
}) {
  const navigate = useNavigate();

  const handleNavigateToUser = (user) => {
    navigate(`/admin/user/${user.id}`, { state: { user } });
  };

  const handleNavigateToOrder = (order) => {
    navigate(`/admin/order/${order.tracker_id}`, { state: { order } });
  };

  if (!currentUser || currentUser.role?.toLowerCase() !== 'admin') {
      return <div className="p-8 text-center">Unauthorized. Admins only.</div>;
  }

  return (
    <Routes>
        <Route path="/" element={
            <DataOverview
                ornaments={ornaments}
                users={users}
                currentUser={currentUser}
                isLoading={isLoading}
                error={error}
                onInviteAdmin={onInviteAdmin}
                onCreateOrnament={onCreateOrnament}
                orders={orders}
                onNavigateToUser={handleNavigateToUser}
                onNavigateToOrder={handleNavigateToOrder}
            />
        } />
        {/* We can pass state directly below or let components fetch it. For now, since it is passed via Route state, the component needs to adapt. We'll wrap them inline for speed. */}
    </Routes>
  );
}

export default AdminDashboard;
