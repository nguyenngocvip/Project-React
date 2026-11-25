import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuction } from './context/AuctionContext';
import Layout from './components/Layout';
import MarketplacePage from './pages/MarketplacePage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { user } = useAuction();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MarketplacePage />} />
        <Route path="auction/:id" element={<AuctionDetailPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}