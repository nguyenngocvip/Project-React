import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';

export default function PaymentModal() {
  const { user, modals, closePaymentModal, completePayment, sandboxTopUpWallet, pushNotification } = useAuction();
  const [method, setMethod] = useState('bank'); // Mặc định mở sẵn VietQR để dễ thấy QR ngay

  const item = modals.paymentItem;
  if (!item) return null;

  const isDeposit = item.paymentType === 'deposit';
  const amountToPay = isDeposit
    ? Math.round(item.currentPrice * 0.1)
    : item.currentPrice;

  const walletBalance = user?.walletBalance || 0;
  const isEnoughBalance = method === 'bank' || walletBalance >= amountToPay;

  // Thông tin chuyển khoản & trỏ trực tiếp tới file public/qr.jpg của bạn
  const transferContent = `${isDeposit ? 'COC' : 'ESCROW'} NQH${item.id}`;
  const qrUrl = '/qr.jpg';

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    if (pushNotification) {
      pushNotification(`📋 Đã sao chép ${label}: ${text}`, 'info');
    }
  };

  const handleConfirmPayment = () => {
    completePayment(item, item.paymentType || 'escrow', amountToPay);
    closePaymentModal();
  };

  return (
    <div
      onClick={closePaymentModal}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 70,
        padding: '16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#161214',
          border: '1px solid #38282E',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)',
          color: '#FAFAFA'
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#0E0B0C',
            padding: '16px 22px',
            borderBottom: '1px solid #2A2024',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#FB7185' }}>
              {isDeposit ? '🔒 Đặt cọc bảo đảm (10%)' : '🛡️ Thanh toán Trung gian Escrow'}
            </h3>
            <span style={{ fontSize: '11.5px', color: '#A1A1AA' }}>
              Mã giao dịch: #ESC-{item.id}
            </span>
          </div>
          <button
            type="button"
            onClick={closePaymentModal}
            style={{
              background: 'none',
              border: 'none',
              color: '#A1A1AA',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Nội dung thanh toán */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Thông tin sản phẩm & Số tiền */}
          <div
            style={{
              backgroundColor: '#0C0A0B',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #261D21'
            }}
          >
            <div style={{ fontSize: '11.5px', color: '#A1A1AA' }}>Tài sản giao dịch</div>
            <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#FAFAFA', marginTop: '2px' }}>
              {item.title}
            </div>
            <div
              style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #221A1E',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '13px', color: '#D4D4D8' }}>
                {isDeposit ? 'Số tiền cọc (10%):' : 'Tổng thanh toán Escrow:'}
              </span>
              <strong style={{ fontSize: '19px', color: '#10B981' }}>
                {amountToPay.toLocaleString()}đ
              </strong>
            </div>
          </div>

          {/* Chọn phương thức thanh toán */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#A1A1AA', textTransform: 'uppercase' }}>
              Chọn phương thức thanh toán
            </div>

            <label
              onClick={() => setMethod('bank')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                border: method === 'bank' ? '1px solid #E11D48' : '1px solid #2A2024',
                backgroundColor: method === 'bank' ? 'rgba(225, 29, 72, 0.1)' : '#0C0A0B',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <span>
                <input
                  type="radio"
                  checked={method === 'bank'}
                  onChange={() => setMethod('bank')}
                  style={{ marginRight: '8px' }}
                />
                Quét mã VietQR / Chuyển khoản 24/7
              </span>
              <span style={{ fontSize: '11px', color: '#34D399', fontWeight: '700' }}>Tự động duyệt</span>
            </label>

            <label
              onClick={() => setMethod('wallet')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                border: method === 'wallet' ? '1px solid #E11D48' : '1px solid #2A2024',
                backgroundColor: method === 'wallet' ? 'rgba(225, 29, 72, 0.1)' : '#0C0A0B',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <span>
                <input
                  type="radio"
                  checked={method === 'wallet'}
                  onChange={() => setMethod('wallet')}
                  style={{ marginRight: '8px' }}
                />
                Ví Đặt Cọc NQH
              </span>
              <strong style={{ color: walletBalance >= amountToPay ? '#10B981' : '#FB7185' }}>
                Số dư: {walletBalance.toLocaleString()}đ
              </strong>
            </label>
          </div>

          {/* KHUNG HIỂN THỊ MÃ QR KHI CHỌN CHUYỂN KHOẢN */}
          {method === 'bank' && (
            <div
              style={{
                backgroundColor: '#0C0A0B',
                border: '1px solid #38282E',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px',
                  borderRadius: '10px',
                  width: '155px',
                  height: '155px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={qrUrl}
                  alt="Mã QR thanh toán"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ color: '#FB7185', fontWeight: '700' }}>
                  📱 Quét mã bằng App Ngân hàng bất kỳ
                </div>

                <div style={infoRowStyle}>
                  <span style={{ color: '#A1A1AA' }}>Ngân hàng:</span>
                  <strong style={{ color: '#FAFAFA' }}>VP Bank (Quân Đội)</strong>
                </div>

                <div style={infoRowStyle}>
                  <span style={{ color: '#A1A1AA' }}>Số TK Escrow:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('1129042007', 'Số tài khoản')}
                    style={copyBtnStyle}
                    title="Bấm để sao chép"
                  >
                    1129042007 📋
                  </button>
                </div>

                <div style={infoRowStyle}>
                  <span style={{ color: '#A1A1AA' }}>Chủ TK:</span>
                  <strong style={{ color: '#FAFAFA' }}>NQH AUCTION ESCROW</strong>
                </div>

                <div style={infoRowStyle}>
                  <span style={{ color: '#A1A1AA' }}>Nội dung CK:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferContent, 'Nội dung chuyển khoản')}
                    style={{ ...copyBtnStyle, color: '#34D399' }}
                    title="Bấm để sao chép"
                  >
                    {transferContent} 📋
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cảnh báo nếu chọn Ví mà chưa đủ tiền */}
          {!isEnoughBalance && (
            <div
              style={{
                backgroundColor: 'rgba(225, 29, 72, 0.12)',
                border: '1px solid rgba(225, 29, 72, 0.4)',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#FDA4AF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Số dư ví chưa đủ. Hãy chuyển sang Quét mã VietQR hoặc nạp nhanh ví.</span>
              {sandboxTopUpWallet && (
                <button
                  type="button"
                  onClick={sandboxTopUpWallet}
                  style={{
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + Nạp Ví (Sandbox)
                </button>
              )}
            </div>
          )}

          {/* Cam kết Escrow */}
          <p style={{ margin: 0, fontSize: '11.5px', color: '#A1A1AA', lineHeight: '1.5' }}>
            {isDeposit
              ? 'Khoản đặt cọc sẽ được hoàn trả 100% về ví nếu bạn không thắng phiên đấu giá này.'
              : 'Sau khi quét mã chuyển khoản xong, bấm nút xác nhận bên dưới để hệ thống ghi nhận trạng thái giữ tiền Escrow.'}
          </p>

          {/* Nút hành động */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={closePaymentModal}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #38282E',
                backgroundColor: 'transparent',
                color: '#A1A1AA',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={!isEnoughBalance}
              onClick={handleConfirmPayment}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isEnoughBalance ? '#E11D48' : '#3F3F46',
                color: isEnoughBalance ? '#FFFFFF' : '#71717A',
                fontWeight: '800',
                cursor: isEnoughBalance ? 'pointer' : 'not-allowed',
                fontSize: '13.5px',
                boxShadow: isEnoughBalance ? '0 4px 14px rgba(225, 29, 72, 0.35)' : 'none'
              }}
            >
              {method === 'bank' ? '✓ Tôi đã chuyển khoản xong' : isDeposit ? 'Xác nhận Nạp Cọc' : 'Xác nhận Thanh toán'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '6px'
};

const copyBtnStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#FAFAFA',
  fontWeight: '700',
  fontSize: '12px',
  cursor: 'pointer'
};