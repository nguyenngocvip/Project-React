import React from 'react';
import { useAuction } from '../context/AuctionContext';

export default function WinnerContactModal({ winnerInfo, product, onClose }) {
  const { pushNotification } = useAuction();

  if (!winnerInfo || !product) return null;

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    pushNotification(`📋 Đã sao chép ${label}: ${text}`, 'info');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 90,
        padding: '16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#161214',
          border: '1px solid #38282E',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
          color: '#FAFAFA',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1F1418 0%, #0E0B0C 100%)',
            padding: '20px 22px',
            borderBottom: '1px solid #2A2024',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                color: '#34D399',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '3px 10px',
                borderRadius: '20px'
              }}
            >
              🏆 KHÁCH HÀNG THẮNG ĐẤU GIÁ
            </span>
            <h3 style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: '800' }}>
              Thông tin liên hệ & Giao hàng
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#A1A1AA',
              fontSize: '26px',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Nội dung chi tiết khách hàng */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tóm tắt sản phẩm chốt */}
          <div
            style={{
              backgroundColor: '#0C0A0B',
              border: '1px solid #261D21',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#A1A1AA' }}>Tài sản chốt phiên #{product.id}</div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FAFAFA', marginTop: '2px' }}>
                {product.title}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#A1A1AA' }}>Giá thắng</div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#10B981' }}>
                {product.currentPrice.toLocaleString()}đ
              </div>
            </div>
          </div>

          {/* Thông tin người thắng */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={rowStyle}>
              <span style={{ color: '#A1A1AA' }}>Họ tên khách hàng:</span>
              <strong style={{ color: '#FAFAFA' }}>{winnerInfo.name}</strong>
            </div>

            <div style={rowStyle}>
              <span style={{ color: '#A1A1AA' }}>Số điện thoại / Zalo:</span>
              <button
                type="button"
                onClick={() => handleCopy(winnerInfo.phone, 'Số điện thoại')}
                style={copyBtnStyle}
              >
                {winnerInfo.phone} 📋
              </button>
            </div>

            <div style={rowStyle}>
              <span style={{ color: '#A1A1AA' }}>Email nhận hóa đơn:</span>
              <button
                type="button"
                onClick={() => handleCopy(winnerInfo.email, 'Email')}
                style={copyBtnStyle}
              >
                {winnerInfo.email} 📋
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#0C0A0B',
                border: '1px solid #2F2227',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#FB7185', fontWeight: '700' }}>
                  📍 Địa chỉ giao hàng đã xác thực KYC:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(winnerInfo.address, 'Địa chỉ giao hàng')}
                  style={{ ...copyBtnStyle, fontSize: '12px', color: '#34D399' }}
                >
                  Sao chép địa chỉ 📋
                </button>
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#FAFAFA', lineHeight: '1.5' }}>
                {winnerInfo.address}
              </div>
            </div>

            <div style={rowStyle}>
              <span style={{ color: '#A1A1AA' }}>Trạng thái thanh toán:</span>
              <span style={{ color: '#FBBF24', fontWeight: '700' }}>
                {product.escrowStatus || '🛡️ Đã cọc bảo đảm / Chờ thanh toán Escrow'}
              </span>
            </div>
          </div>

          {/* Nút hành động */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => {
                pushNotification(`🚚 Đã gửi thông báo bàn giao vận chuyển tới ${winnerInfo.name}!`, 'success');
                onClose();
              }}
              style={{
                flex: 1,
                backgroundColor: '#10B981',
                color: '#052E16',
                border: 'none',
                padding: '11px',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              🚚 Xác nhận đã liên hệ & Gửi hàng
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#231D20',
                color: '#D4D4D8',
                border: '1px solid #38282E',
                padding: '11px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#0C0A0B',
  border: '1px solid #261D21',
  padding: '10px 14px',
  borderRadius: '8px'
};

const copyBtnStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#FAFAFA',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer'
};