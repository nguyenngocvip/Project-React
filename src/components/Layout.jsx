import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuction } from '../context/AuctionContext';
import Navbar from './Navbar';
import Footer from './Footer';
import SandboxPanel from './SandboxPanel';
import LoginModal from './LoginModal';
import CreateAuctionModal from './CreateAuctionModal';
import PaymentModal from './PaymentModal';

export default function Layout() {
  const { notifications } = useAuction();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0C0A0B',
        color: '#FAFAFA'
      }}
    >
      {/* Thông báo thời gian thực toàn cục */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '340px'
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              backgroundColor: '#161214',
              borderLeft: '4px solid #E11D48',
              padding: '14px 16px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
              fontSize: '13px',
              color: '#FAFAFA',
              border: '1px solid #2C2226'
            }}
          >
            <div style={{ fontWeight: '700', marginBottom: '4px', color: '#FB7185' }}>
              🔔 Thông báo trực tiếp
            </div>
            {n.message}
          </div>
        ))}
      </div>

      <Navbar />

      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <Outlet />
      </main>

      <Footer />

      <SandboxPanel />
      <LoginModal />
      <CreateAuctionModal />
      <PaymentModal />
    </div>
  );
}