import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuction } from '../context/AuctionContext';

export default function Navbar() {
  const {
    user,
    logout,
    openLoginModal,
    isSandboxEnabled,
    toggleSandbox
  } = useAuction();

  const [now, setNow] = useState(() => new Date());
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('vi-VN', { hour12: false });

  return (
    <header
      style={{
        backgroundColor: '#120E10',
        borderBottom: '1px solid #2A2024',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Logo + Đồng hồ thời gian thực */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none'
            }}
          >
            <span
              style={{
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                fontWeight: '900',
                fontSize: '15px',
                padding: '6px 10px',
                borderRadius: '8px',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)'
              }}
            >
              NQH
            </span>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#FAFAFA', letterSpacing: '0.5px' }}>
              NQH <span style={{ color: '#FB7185' }}>AUCTION</span>
            </span>
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#181315',
              border: '1px solid #2F2227',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#D4D4D8'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>{formattedDate}</span>
            <span style={{ color: '#52525B' }}>|</span>
            <strong style={{ color: '#FB7185', fontFamily: 'monospace', fontSize: '13px' }}>
              {formattedTime}
            </strong>
          </div>
        </div>

        {/* Menu điều hướng + Vùng bí mật Sandbox + Tài khoản */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Vùng bí mật kích hoạt Sandbox */}
          <button
            type="button"
            onClick={toggleSandbox}
            aria-label="Toggle Sandbox Mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              minWidth: '125px',
              height: '36px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: isSandboxEnabled ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid transparent',
              backgroundColor: isSandboxEnabled ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              color: isSandboxEnabled ? '#34D399' : 'transparent',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'default',
              userSelect: 'none',
              outline: 'none',
              transition: 'all 0.25s ease'
            }}
          >
            {isSandboxEnabled && (
              <>
                <span>🧪 Sandbox:</span>
                <span>BẬT</span>
              </>
            )}
          </button>

          <Link to="/" style={navLinkStyle(isActive('/'))}>
            🏛️ Sàn đấu giá
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={navLinkStyle(isActive('/dashboard'))}>
                📊 Quản lý phiên
              </Link>

              <Link to="/profile" style={navLinkStyle(isActive('/profile'))}>
                👤 {user.name}
              </Link>

              <button
                type="button"
                onClick={logout}
                style={{
                  backgroundColor: '#231D20',
                  color: '#FDA4AF',
                  border: '1px solid #38282E',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              style={{
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
              }}
            >
              Đăng nhập / KYC
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

const navLinkStyle = (active) => ({
  textDecoration: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '700',
  backgroundColor: active ? '#E11D48' : '#161214',
  color: active ? '#FFFFFF' : '#D4D4D8',
  border: active ? '1px solid #E11D48' : '1px solid #2F2227',
  boxShadow: active ? '0 4px 12px rgba(225, 29, 72, 0.35)' : 'none'
});