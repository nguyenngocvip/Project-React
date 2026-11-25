import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';

export default function SandboxPanel() {
  const {
    user,
    products,
    isSandboxEnabled,
    openLoginModal,
    sandboxTopUpWallet,
    sandboxSimulateBotBid,
    sandboxFastForwardEnd
  } = useAuction();

  const [isOpen, setIsOpen] = useState(false);

  const activeProducts = products.filter((p) => new Date(p.endTime).getTime() > Date.now());
  const [selectedProductId, setSelectedProductId] = useState('');

  // Tự động đồng bộ & chọn sản phẩm mới nhất (như sản phẩm vừa đăng bán) trong dropdown
  useEffect(() => {
    if (activeProducts.length === 0) {
      setSelectedProductId('');
      return;
    }

    const stillExists = activeProducts.some((p) => String(p.id) === String(selectedProductId));
    if (!stillExists) {
      setSelectedProductId(String(activeProducts[0].id));
    }
  }, [products.length, activeProducts.length]);

  // Khi người dùng vừa đăng sản phẩm mới lên đầu danh sách (id lớn / mới nhất), tự chọn luôn sản phẩm đó
  useEffect(() => {
    if (activeProducts.length > 0) {
      setSelectedProductId(String(activeProducts[0].id));
    }
  }, [products[0]?.id]);

  // Ẩn hoàn toàn nút và bảng Sandbox nếu công tắc Sandbox đang tắt
  if (!isSandboxEnabled) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 999 }}>
      {/* Nút bật/tắt Sandbox */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#161214',
            color: '#FB7185',
            border: '1px solid #E11D48',
            padding: '10px 16px',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(225, 29, 72, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🧪 Sandbox Kiểm Thử
        </button>
      ) : (
        <div
          style={{
            width: '340px',
            backgroundColor: '#161214',
            border: '1px solid #E11D48',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2A2024', paddingBottom: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '13.5px', color: '#FB7185' }}>
              🧪 SANDBOX GIẢ LẬP HỆ THỐNG
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#A1A1AA', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
            >
              &times;
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '11.5px', color: '#A1A1AA', lineHeight: '1.4' }}>
            Công cụ mô phỏng sự kiện thời gian thực để kiểm thử luồng đấu giá, đặt cọc và thanh toán Escrow.
          </p>

          {/* Kịch bản 1: Tài khoản & Ví tiền */}
          <div style={boxStyle}>
            <div style={labelStyle}>1. Tài khoản & Số dư Ví</div>
            {!user ? (
              <button type="button" onClick={openLoginModal} style={btnStyle('#E11D48', '#FFFFFF')}>
                🔑 Mở Form Đăng nhập / KYC nhanh
              </button>
            ) : (
              <button type="button" onClick={sandboxTopUpWallet} style={btnStyle('#271D21', '#FDA4AF', '1px solid #E11D48')}>
                💰 Nạp nhanh +500.000.000đ vào Ví
              </button>
            )}
          </div>

          {/* Kịch bản 2: Tác động lên phiên đấu giá */}
          <div style={boxStyle}>
            <div style={labelStyle}>2. Chọn phiên đấu giá để giả lập</div>
            <select
              value={String(selectedProductId)}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #38282E',
                backgroundColor: '#0C0A0B',
                color: '#FAFAFA',
                fontSize: '12px',
                marginBottom: '8px'
              }}
            >
              {activeProducts.length === 0 ? (
                <option value="">Không có phiên nào đang chạy</option>
              ) : (
                activeProducts.map((p) => {
                  const isMine =
                    user &&
                    ((p.sellerId && String(user.id) === String(p.sellerId)) ||
                      (p.seller?.name && user.name === p.seller.name));
                  return (
                    <option key={p.id} value={String(p.id)}>
                      {isMine ? '⭐ [Của bạn] ' : ''}#{p.id} - {p.title}
                    </option>
                  );
                })
              )}
            </select>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                disabled={activeProducts.length === 0}
                onClick={() => sandboxSimulateBotBid(selectedProductId)}
                style={btnStyle('#E11D48', '#FFFFFF')}
              >
                🤖 Bot đối thủ trả giá cao hơn (+1 bước)
              </button>

              <button
                type="button"
                disabled={activeProducts.length === 0}
                onClick={() => sandboxFastForwardEnd(selectedProductId)}
                style={btnStyle('#231D20', '#FAFAFA', '1px solid #38282E')}
              >
                ⏩ Tua nhanh đồng hồ về còn 5 giây
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const boxStyle = {
  backgroundColor: '#0C0A0B',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #261D21'
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#D4D4D8',
  marginBottom: '6px',
  textTransform: 'uppercase'
};

const btnStyle = (bg, color, border = 'none') => ({
  width: '100%',
  backgroundColor: bg,
  color,
  border,
  padding: '8px 10px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer'
});