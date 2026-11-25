import React, { useState, useMemo } from 'react';
import { useAuction } from '../context/AuctionContext';

const SAMPLE_PRODUCTS = [
  { title: 'Đồng hồ Omega Seamaster Diver 300M Co-Axial', basePrice: 118000000 },
  { title: 'Túi Hermès Birkin 30 Togo Leather Gold Hardware', basePrice: 345000000 },
  { title: 'Leica M11 Rangefinder Camera Body (Black)', basePrice: 192000000 },
  { title: 'Đồng hồ Rolex Datejust 36 Wimbledon Dial', basePrice: 265000000 },
  { title: 'Đồng hồ Cartier Santos Medium Stainless Steel', basePrice: 168000000 },
  { title: 'Bút ký Montblanc Meisterstück 149 Gold-Coated', basePrice: 18500000 },
  { title: 'Đồng hồ Patek Philippe Calatrava 5227G', basePrice: 680000000 },
  { title: 'Túi Chanel Classic Flap Medium Caviar', basePrice: 230000000 },
  { title: 'Bình gốm Chu Đậu vẽ vàng 24K nghệ nhân chế tác', basePrice: 42000000 },
  { title: 'Đồng hồ Tag Heuer Carrera Chronograph Calibre 16', basePrice: 76000000 }
];

const SAMPLE_BUYERS = [
  'Trần Minh K***',
  'Nguyễn Thảo V***',
  'Lê Hoàng N***',
  'Phạm Quốc B***',
  'Đặng Ngọc A***',
  'Vũ Hải Đ***',
  'Bùi Thanh T***',
  'Hoàng Gia H***'
];

const SAMPLE_COMMENTS = [
  'Hàng chuẩn chính hãng 100%, đầy đủ thẻ bảo hành quốc tế và hộp sổ. Đóng gói chống sốc cực kỳ cẩn thận.',
  'Đơn vị ký gửi hỗ trợ kiểm định rất minh bạch, giao hàng hỏa tốc ngay sau khi mình thanh toán Escrow.',
  'Sản phẩm đẹp như mới đúng mô tả, tư vấn nhiệt tình. Rất yên tâm khi đấu giá từ đối tác này.',
  'Quy trình bàn giao qua Escrow chuyên nghiệp, kiểm tra đúng tình trạng mới giải ngân nên rất an tâm.',
  'Đã giao dịch lần thứ 3 với shop, lần nào cũng chuẩn chỉ và đúng hẹn.'
];

export default function SellerProfileModal({ seller, onClose }) {
  const { products, pushNotification } = useAuction();
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'reviews'
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(10);
  const [visibleReviewCount, setVisibleReviewCount] = useState(10);
  const [searchTx, setSearchTx] = useState('');

  if (!seller) return null;

  const baseSalesCount = seller.totalSales ?? 142;

  // Lọc các phiên của cùng người bán này trong hệ thống
  const sellerProducts = products.filter(
    (p) => (p.seller?.name || 'Luxury Store VN') === (seller.name || 'Luxury Store VN')
  );

  // Sinh danh sách lịch sử giao dịch thành công khớp 100% với tổng số phiên thành công
  const completedTransactions = useMemo(() => {
    const liveCompleted = sellerProducts
      .filter((p) => p.escrowStatus === 'Đã giải ngân & Hoàn tất' || p.buyerReview)
      .map((p) => ({
        id: `ESC-${p.id}`,
        title: p.title,
        finalPrice: p.currentPrice,
        date: 'Hôm nay',
        buyer: 'Thành viên NQH***'
      }));

    const historicalList = Array.from({ length: baseSalesCount }, (_, index) => {
      const sample = SAMPLE_PRODUCTS[index % SAMPLE_PRODUCTS.length];
      const buyer = SAMPLE_BUYERS[index % SAMPLE_BUYERS.length];
      const codeNumber = 900 - index;
      const daysAgo = (index + 1) * 2;
      const txDate = new Date(Date.now() - daysAgo * 86400000);
      const formattedDate = `${String(txDate.getDate()).padStart(2, '0')}/${String(
        txDate.getMonth() + 1
      ).padStart(2, '0')}/${txDate.getFullYear()}`;

      const priceVariation = ((index % 5) - 2) * 1500000;

      return {
        id: `HIST-${codeNumber}`,
        title: sample.title,
        finalPrice: Math.max(5000000, sample.basePrice + priceVariation),
        date: formattedDate,
        buyer
      };
    });

    return [...liveCompleted, ...historicalList];
  }, [sellerProducts, baseSalesCount]);

  // Sinh danh sách đánh giá tương ứng (không bao giờ vượt quá tổng số phiên thành công)
  const reviews = useMemo(() => {
    const liveReviews = sellerProducts
      .filter((p) => p.buyerReview)
      .map((p, idx) => ({
        id: `rev-live-${idx}`,
        reviewer: 'Người thắng phiên #' + p.id,
        product: p.title,
        rating: 5,
        comment: p.buyerReview,
        date: 'Hôm nay'
      }));

    const reviewTotal =
      baseSalesCount <= 1
        ? baseSalesCount
        : Math.min(baseSalesCount, Math.round(baseSalesCount * 0.68));

    const historicalReviews = Array.from({ length: reviewTotal }, (_, index) => {
      const tx = completedTransactions[index % completedTransactions.length];
      return {
        id: `rev-${index}`,
        reviewer: SAMPLE_BUYERS[index % SAMPLE_BUYERS.length],
        product: tx?.title || SAMPLE_PRODUCTS[0].title,
        rating: index % 11 === 0 ? 4 : 5,
        comment: SAMPLE_COMMENTS[index % SAMPLE_COMMENTS.length],
        date: tx?.date || '18/11/2026'
      };
    });

    return [...liveReviews, ...historicalReviews];
  }, [sellerProducts, baseSalesCount, completedTransactions]);

  const sellerInfo = {
    name: seller.name || 'Luxury Store VN',
    rating: seller.rating || 4.9,
    totalSales: completedTransactions.length,
    badge: seller.badge || 'Đối tác Ký gửi Đã Xác Thực KYC',
    phone: seller.phone || '0908 686 899',
    email: seller.email || 'kygui.partner@nqh-auction.vn',
    address: seller.address || 'Tầng 12, Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh',
    joinedDate: seller.joinedDate || '03/2023',
    responseRate: seller.responseRate || '99% (Phản hồi trong 15 phút)'
  };

  // Lọc theo từ khóa tìm kiếm trong lịch sử giao dịch
  const filteredTransactions = completedTransactions.filter(
    (tx) =>
      tx.title.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTx.toLowerCase())
  );

  const handleCopyContact = (text, label) => {
    navigator.clipboard?.writeText(text);
    if (pushNotification) {
      pushNotification(`📋 Đã sao chép ${label}: ${text}`, 'info');
    }
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
          maxWidth: '660px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
          color: '#FAFAFA'
        }}
      >
        {/* Header Banner Hồ sơ Đơn vị ký gửi */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1F1418 0%, #0E0B0C 100%)',
            padding: '22px 24px',
            borderBottom: '1px solid #2A2024',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '14px',
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: '900',
                boxShadow: '0 6px 18px rgba(225, 29, 72, 0.4)',
                border: '2px solid #FDA4AF',
                flexShrink: 0
              }}
            >
              {sellerInfo.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#FAFAFA' }}>
                  {sellerInfo.name}
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
                  🛡️ {sellerInfo.badge}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12.5px', color: '#A1A1AA', marginTop: '6px' }}>
                <span>
                  <strong style={{ color: '#FBBF24' }}>⭐ {sellerInfo.rating} / 5.0</strong> ({reviews.length} đánh giá)
                </span>
                <span>•</span>
                <span>
                  <strong style={{ color: '#10B981' }}>{sellerInfo.totalSales}</strong> phiên thành công
                </span>
                <span>•</span>
                <span>Tham gia: {sellerInfo.joinedDate}</span>
              </div>
            </div>
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

        {/* Nội dung chính */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Khối Thông tin liên lạc */}
          <div
            style={{
              backgroundColor: '#0C0A0B',
              border: '1px solid #2A2024',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#FB7185', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📞 Thông tin liên lạc & Điểm kiểm định ký gửi
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', fontSize: '13px' }}>
              <div style={contactItemStyle}>
                <span style={{ color: '#A1A1AA' }}>Hotline / Zalo:</span>
                <button
                  type="button"
                  onClick={() => handleCopyContact(sellerInfo.phone, 'Số điện thoại')}
                  style={copyLinkStyle}
                  title="Bấm để sao chép"
                >
                  {sellerInfo.phone} 📋
                </button>
              </div>

              <div style={contactItemStyle}>
                <span style={{ color: '#A1A1AA' }}>Email hỗ trợ:</span>
                <button
                  type="button"
                  onClick={() => handleCopyContact(sellerInfo.email, 'Email')}
                  style={copyLinkStyle}
                  title="Bấm để sao chép"
                >
                  {sellerInfo.email} 📋
                </button>
              </div>

              <div style={{ ...contactItemStyle, gridColumn: '1 / -1' }}>
                <span style={{ color: '#A1A1AA' }}>Địa chỉ Showroom:</span>
                <strong style={{ color: '#FAFAFA', textAlign: 'right' }}>{sellerInfo.address}</strong>
              </div>

              <div style={{ ...contactItemStyle, gridColumn: '1 / -1' }}>
                <span style={{ color: '#A1A1AA' }}>Tỷ lệ phản hồi:</span>
                <span style={{ color: '#34D399', fontWeight: '700' }}>{sellerInfo.responseRate}</span>
              </div>
            </div>
          </div>

          {/* Thanh chuyển Tab */}
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #261D21', paddingBottom: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              style={tabStyle(activeTab === 'history')}
            >
              🏆 Lịch sử giao dịch thành công ({completedTransactions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              style={tabStyle(activeTab === 'reviews')}
            >
              ⭐ Đánh giá từ người mua ({reviews.length})
            </button>
          </div>

          {/* Nội dung Tab 1: Lịch sử giao dịch thành công */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completedTransactions.length > 5 && (
                <input
                  type="text"
                  value={searchTx}
                  onChange={(e) => {
                    setSearchTx(e.target.value);
                    setVisibleHistoryCount(10);
                  }}
                  placeholder={`🔍 Tìm trong ${completedTransactions.length} giao dịch đã hoàn tất (VD: Rolex, Omega, #HIST-900)...`}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #2F2227',
                    backgroundColor: '#0C0A0B',
                    color: '#FAFAFA',
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              )}

              {filteredTransactions.length === 0 ? (
                <p style={{ color: '#71717A', fontSize: '13px', textAlign: 'center', margin: '12px 0' }}>
                  Không tìm thấy giao dịch nào khớp từ khóa "{searchTx}".
                </p>
              ) : (
                <>
                  {filteredTransactions.slice(0, visibleHistoryCount).map((tx) => (
                    <div
                      key={tx.id}
                      style={{
                        backgroundColor: '#0C0A0B',
                        border: '1px solid #261D21',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FAFAFA' }}>
                          <span style={{ color: '#FB7185', marginRight: '6px', fontSize: '12px' }}>#{tx.id}</span>
                          {tx.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#A1A1AA', marginTop: '4px' }}>
                          Người thắng: <strong style={{ color: '#D4D4D8' }}>{tx.buyer}</strong> • Hoàn tất: {tx.date}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>
                          {tx.finalPrice.toLocaleString()}đ
                        </div>
                        <span
                          style={{
                            fontSize: '10.5px',
                            color: '#34D399',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontWeight: '700'
                          }}
                        >
                          ✓ Escrow Hoàn tất
                        </span>
                      </div>
                    </div>
                  ))}

                  {visibleHistoryCount < filteredTransactions.length && (
                    <button
                      type="button"
                      onClick={() => setVisibleHistoryCount((prev) => prev + 15)}
                      style={{
                        backgroundColor: '#231D20',
                        color: '#FDA4AF',
                        border: '1px solid #38282E',
                        padding: '9px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Xem thêm giao dịch cũ hơn (Đang hiện {Math.min(visibleHistoryCount, filteredTransactions.length)} / {filteredTransactions.length})
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Nội dung Tab 2: Đánh giá từ người mua */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reviews.length === 0 ? (
                <p style={{ color: '#71717A', fontSize: '13px', textAlign: 'center', margin: '12px 0' }}>
                  Chưa có đánh giá nào từ người mua.
                </p>
              ) : (
                <>
                  {reviews.slice(0, visibleReviewCount).map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        backgroundColor: '#0C0A0B',
                        border: '1px solid #261D21',
                        borderRadius: '10px',
                        padding: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '13px', color: '#FAFAFA' }}>{rev.reviewer}</strong>
                          <span style={{ color: '#FBBF24', fontSize: '12px' }}>
                            {'★'.repeat(rev.rating)}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#71717A' }}>{rev.date}</span>
                      </div>

                      <div style={{ fontSize: '11.5px', color: '#FB7185', marginBottom: '6px', fontWeight: '600' }}>
                        Sản phẩm: {rev.product}
                      </div>

                      <p style={{ margin: 0, fontSize: '13px', color: '#D4D4D8', lineHeight: '1.5' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}

                  {visibleReviewCount < reviews.length && (
                    <button
                      type="button"
                      onClick={() => setVisibleReviewCount((prev) => prev + 15)}
                      style={{
                        backgroundColor: '#231D20',
                        color: '#FDA4AF',
                        border: '1px solid #38282E',
                        padding: '9px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Xem thêm đánh giá cũ hơn (Đang hiện {Math.min(visibleReviewCount, reviews.length)} / {reviews.length})
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Footer Modal */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                border: 'none',
                padding: '9px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const contactItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#161214',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #241B1F'
};

const copyLinkStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#FAFAFA',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer'
};

const tabStyle = (isActive) => ({
  padding: '8px 14px',
  borderRadius: '8px',
  border: isActive ? '1px solid #E11D48' : '1px solid #2F2227',
  backgroundColor: isActive ? 'rgba(225, 29, 72, 0.15)' : '#0C0A0B',
  color: isActive ? '#FB7185' : '#A1A1AA',
  fontSize: '12.5px',
  fontWeight: '700',
  cursor: 'pointer'
});