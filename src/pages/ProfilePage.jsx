import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuction } from '../context/AuctionContext';

export default function ProfilePage() {
  const { user, depositedIds, watchlist, products, pushNotification, topUpWallet } = useAuction();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '0909 888 999');
  const [address, setAddress] = useState(user?.address || 'Quận 1, TP. Hồ Chí Minh');

  // Trạng thái xác thực SĐT qua OTP
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  // Trạng thái Modal Nạp tiền QR
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(10000000); // Mặc định 10.000.000đ

  if (!user) return null;

  const cccdValue = user?.cccd || '079203008899';

  const myBiddingCount = products.filter((p) =>
    p.bidHistory?.some((b) => b.bidder === user.name)
  ).length;

  const handlePhoneChange = (val) => {
    setPhone(val);
    setIsPhoneVerified(false);
    setShowOtpBox(false);
    setOtpInput('');
  };

  const handleSendOtp = () => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) {
      pushNotification('Vui lòng nhập đúng số điện thoại Việt Nam gồm 10 chữ số (bắt đầu bằng 0)!', 'warning');
      return;
    }
    setShowOtpBox(true);
    pushNotification(`📱 Mã OTP xác thực đã gửi tới ${phone}. Mã test của bạn là: 686868`, 'info');
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() === '686868') {
      setIsPhoneVerified(true);
      setShowOtpBox(false);
      setOtpInput('');
      pushNotification('✅ Xác thực số điện thoại thành công!', 'info');
    } else {
      pushNotification('❌ Mã OTP chưa chính xác (Gợi ý mã test: 686868)', 'warning');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    pushNotification('Đã lưu thay đổi thông tin hồ sơ cá nhân!', 'info');
  };

  // Tạo link ảnh VietQR động theo số tiền người dùng chọn nạp
  const transferNote = `NAPVI ${user.name?.toUpperCase().replace(/\s+/g, '') || 'NQH'}`;
  const validAmount = Math.max(100000, Number(topUpAmount) || 0);
  const qrUrl = `https://img.vietqr.io/image/MB-99996868888-compact2.png?amount=${validAmount}&addInfo=${encodeURIComponent(
    transferNote
  )}&accountName=${encodeURIComponent('CONG TY NQH AUCTION ESCROW')}`;

  const handleConfirmTopUp = () => {
    if (topUpWallet) {
      topUpWallet(validAmount);
    }
    setIsTopUpOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner Hồ sơ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1B1316 0%, #141012 100%)',
          border: '1px solid #2F2227',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '800',
              boxShadow: '0 8px 20px rgba(225, 29, 72, 0.4)',
              border: '2px solid #FDA4AF'
            }}
          >
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#FAFAFA' }}>
                {user.name}
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}
              >
                ✓ Đã xác thực KYC
              </span>
            </div>
            <div style={{ fontSize: '13.5px', color: '#A1A1AA', marginTop: '4px' }}>
              {user.email || 'thanhvien@nqh-auction.vn'} • Thành viên hạng <strong style={{ color: '#FB7185' }}>VIP Ruby</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            style={{
              backgroundColor: '#231D20',
              color: '#FAFAFA',
              border: '1px solid #382E33',
              padding: '10px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            📊 Quản lý Phiên & Escrow
          </Link>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'Hủy chỉnh sửa' : '✏️ Chỉnh sửa liên hệ'}
          </button>
        </div>
      </div>

      {/* Thống kê nhanh 4 ô */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Số dư Ví Đặt Cọc</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#FB7185', margin: '6px 0' }}>
            {(user.walletBalance || 0).toLocaleString()}đ
          </div>
          <button
            type="button"
            onClick={() => setIsTopUpOpen(true)}
            style={{
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '2px'
            }}
          >
            + Nạp tiền
          </button>
        </div>

        <div style={statCardStyle}>
          <div style={statLabelStyle}>Phiên đã đặt cọc bảo đảm</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#FAFAFA', margin: '6px 0' }}>
            {depositedIds?.length || 0} phiên
          </div>
          <div style={{ fontSize: '12px', color: '#A1A1AA' }}>Được hoàn 100% nếu không thắng</div>
        </div>

        <div style={statCardStyle}>
          <div style={statLabelStyle}>Phiên đang tham gia trả giá</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#FAFAFA', margin: '6px 0' }}>
            {myBiddingCount} phiên
          </div>
          <div style={{ fontSize: '12px', color: '#A1A1AA' }}>Theo dõi biến động theo thời gian thực</div>
        </div>

        <div style={statCardStyle}>
          <div style={statLabelStyle}>Tài sản yêu thích (Watchlist)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#FAFAFA', margin: '6px 0' }}>
            {watchlist?.length || 0} sản phẩm
          </div>
          <div style={{ fontSize: '12px', color: '#A1A1AA' }}>Nhận thông báo khi sắp hết giờ</div>
        </div>
      </div>

      {/* Chi tiết thông tin cá nhân & Định danh */}
      <form
        onSubmit={handleSaveProfile}
        style={{
          backgroundColor: '#161214',
          border: '1px solid #2A2024',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#FAFAFA', borderBottom: '1px solid #261D21', paddingBottom: '12px' }}>
          Thông tin định danh & Địa chỉ giao nhận Escrow
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          <div>
            <label style={fieldLabelStyle}>Họ và tên (Theo CCCD)</label>
            <input type="text" value={user.name} disabled style={inputStyle(true)} />
          </div>

          <div>
            <label style={fieldLabelStyle}>Email đăng nhập</label>
            <input type="email" value={user.email || 'thanhvien@nqh-auction.vn'} disabled style={inputStyle(true)} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ ...fieldLabelStyle, marginBottom: 0 }}>Số CCCD / Hộ chiếu</label>
              <span style={{ fontSize: '11px', color: '#34D399', fontWeight: '700' }}>
                🔒 Đã KYC cố định
              </span>
            </div>
            <input
              type="text"
              value={cccdValue}
              disabled
              title="Số CCCD đã xác thực KYC không thể chỉnh sửa"
              style={{ ...inputStyle(true), cursor: 'not-allowed', opacity: 0.85 }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ ...fieldLabelStyle, marginBottom: 0 }}>Số điện thoại liên hệ</label>
              {isPhoneVerified ? (
                <span style={{ fontSize: '11px', color: '#34D399', fontWeight: '700' }}>
                  ✓ Đã xác thực SMS
                </span>
              ) : (
                <span style={{ fontSize: '11px', color: '#FB7185', fontWeight: '700' }}>
                  ⚠ Chưa xác thực
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={phone}
                disabled={!isEditing && isPhoneVerified}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Nhập SĐT 10 số..."
                style={{ ...inputStyle(!isEditing && isPhoneVerified), flex: 1 }}
              />

              {!isPhoneVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Xác thực SĐT
                </button>
              )}
            </div>

            {showOtpBox && !isPhoneVerified && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#0C0A0B',
                  border: '1px solid rgba(225, 29, 72, 0.45)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Nhập OTP (686868)"
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #38282E',
                    backgroundColor: '#161214',
                    color: '#FAFAFA',
                    fontSize: '13px',
                    letterSpacing: '2px',
                    fontWeight: '700'
                  }}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  style={{
                    backgroundColor: '#10B981',
                    color: '#09090B',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Xác nhận
                </button>
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={fieldLabelStyle}>Địa chỉ nhận tài sản thắng đấu giá</label>
            <input
              type="text"
              value={address}
              disabled={!isEditing}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle(!isEditing)}
            />
          </div>
        </div>

        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              💾 Lưu thay đổi
            </button>
          </div>
        )}
      </form>

      {/* MODAL NẠP TIỀN QUA MÃ QR VIETQR */}
      {isTopUpOpen && (
        <div
          onClick={() => setIsTopUpOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 80,
            padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#161214',
              border: '1px solid #38282E',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)'
            }}
          >
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
              <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '800', color: '#FB7185' }}>
                💳 Nạp tiền vào Ví Đặt Cọc qua VietQR
              </h3>
              <button
                type="button"
                onClick={() => setIsTopUpOpen(false)}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={fieldLabelStyle}>Chọn hoặc nhập số tiền muốn nạp (VNĐ)</label>
                <input
                  type="number"
                  min={100000}
                  step={100000}
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  style={{ ...inputStyle(false), fontWeight: '800', fontSize: '16px', color: '#10B981' }}
                />

                {/* Các mốc chọn nhanh */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {[5000000, 10000000, 50000000, 100000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTopUpAmount(preset)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: topUpAmount === preset ? '1px solid #E11D48' : '1px solid #2F2227',
                        backgroundColor: topUpAmount === preset ? 'rgba(225, 29, 72, 0.15)' : '#0C0A0B',
                        color: topUpAmount === preset ? '#FB7185' : '#D4D4D8',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      +{(preset / 1000000).toLocaleString()} Tr
                    </button>
                  ))}
                </div>
              </div>

              {/* Khung mã QR động */}
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
                    padding: '8px',
                    borderRadius: '10px',
                    width: '145px',
                    height: '145px',
                    margin: '0 auto'
                  }}
                >
                  <img
                    src={qrUrl}
                    alt="QR Nạp tiền Ví NQH"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: '190px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ color: '#FB7185', fontWeight: '700' }}>Quét mã VietQR để nạp ví</div>
                  <div style={{ color: '#A1A1AA' }}>Ngân hàng: <strong style={{ color: '#FAFAFA' }}>MB Bank</strong></div>
                  <div style={{ color: '#A1A1AA' }}>Số TK: <strong style={{ color: '#FAFAFA' }}>9999 6868 888</strong></div>
                  <div style={{ color: '#A1A1AA' }}>Số tiền: <strong style={{ color: '#10B981' }}>{validAmount.toLocaleString()}đ</strong></div>
                  <div style={{ color: '#A1A1AA' }}>Nội dung: <strong style={{ color: '#34D399' }}>{transferNote}</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
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
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTopUp}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)'
                  }}
                >
                  ✓ Tôi đã chuyển khoản nạp ví
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const statCardStyle = {
  backgroundColor: '#161214',
  border: '1px solid #2A2024',
  borderRadius: '12px',
  padding: '18px'
};

const statLabelStyle = {
  fontSize: '12px',
  color: '#A1A1AA',
  fontWeight: '600'
};

const fieldLabelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#A1A1AA',
  marginBottom: '6px',
  fontWeight: '600'
};

const inputStyle = (disabled) => ({
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #2F2227',
  backgroundColor: disabled ? '#0C0A0B' : '#1F181B',
  color: disabled ? '#A1A1AA' : '#FAFAFA',
  fontSize: '13.5px',
  boxSizing: 'border-box'
});