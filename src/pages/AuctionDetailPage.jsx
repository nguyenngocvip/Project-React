import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuction } from '../context/AuctionContext';
import SellerProfileModal from '../components/SellerProfileModal';
import WinnerContactModal from '../components/WinnerContactModal';

const MOCK_WINNER_PROFILES = {
  'Đại Gia Quận 1 (Bot)': {
    name: 'Nguyễn Minh Quân (Đại Gia Quận 1)',
    phone: '0909 888 999',
    email: 'minhquan.vip@gmail.com',
    address: 'Căn hộ Penthouse B2-36, Vinhomes Golden River, Số 2 Tôn Đức Thắng, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  },
  'Sưu Tầm Cổ Vật (Bot)': {
    name: 'Trần Đình Bảo (Sưu Tầm Cổ Vật)',
    phone: '0918 456 789',
    email: 'dinhbao.antique@gmail.com',
    address: 'Số 48 Phan Đình Phùng, Phường Quán Thánh, Quận Ba Đình, Hà Nội'
  },
  'Shark Hưng (Bot)': {
    name: 'Phạm Thanh Hưng',
    phone: '0988 123 456',
    email: 'thanhhung.invest@gmail.com',
    address: 'Biệt thự Hoa Lan 05-12, Khu đô thị Vinhomes Riverside, Quận Long Biên, Hà Nội'
  }
};

export default function AuctionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    products,
    watchlist,
    depositedIds,
    toggleWatchlist,
    placeBid,
    buyItNow,
    openPaymentModal,
    pushNotification
  } = useAuction();

  const item = products.find((p) => String(p.id) === String(id));

  const [bidTab, setBidTab] = useState('manual');
  const [bidAmount, setBidAmount] = useState(0);
  const [maxProxyAmount, setMaxProxyAmount] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (item) {
      const nextMin = item.currentPrice + (item.minStep || 500000);
      setBidAmount(nextMin);
      setMaxProxyAmount(nextMin + (item.minStep || 500000) * 2);
    }
  }, [item?.id, item?.currentPrice]);

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A1A1AA' }}>
        <h2>Không tìm thấy phiên đấu giá này</h2>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginTop: '12px',
            backgroundColor: '#E11D48',
            color: '#FFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Quay lại Sàn đấu giá
        </button>
      </div>
    );
  }

  // Kiểm tra tài khoản hiện tại có phải là Người Bán (Chủ phiên) hay không
  const isOwner = Boolean(
    user &&
      ((item.sellerId && String(user.id) === String(item.sellerId)) ||
        (item.seller?.name && user.name === item.seller.name))
  );

  const endTimeMs = new Date(item.endTime).getTime();
  const remainingMs = Math.max(0, endTimeMs - now);
  const isEnded = remainingMs === 0;

  const hours = String(Math.floor(remainingMs / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((remainingMs % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, '0');

  const isWatched = watchlist.includes(item.id);
  const hasDeposited = depositedIds.includes(item.id);
  const minNextBid = item.currentPrice + (item.minStep || 500000);

  // Xác định người trả giá cao nhất (Khách hàng thắng cuộc)
  const highestBid = item.bidHistory && item.bidHistory.length > 0 ? item.bidHistory[0] : null;
  const cleanWinnerName = highestBid?.bidder
    ? highestBid.bidder.replace(' (Tự động 🤖)', '').replace(' (Mua ngay ⚡)', '').trim()
    : '';

  // So sánh chính xác tên người thắng cuộc với người dùng đang đăng nhập
  const isWinner = Boolean(user && cleanWinnerName && cleanWinnerName === user.name.trim());

  const winnerProfile = highestBid
    ? MOCK_WINNER_PROFILES[highestBid.bidder] || {
        name: cleanWinnerName,
        phone: '0903 777 555',
        email: 'khachhang.kyc@nqh-auction.vn',
        address: 'Số 125 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
      }
    : null;

  const handleManualBid = async (e) => {
    e.preventDefault();
    if (bidAmount < minNextBid) {
      pushNotification(`⚠️ Giá đặt tối thiểu phải từ ${minNextBid.toLocaleString()}đ trở lên!`, 'warning');
      return;
    }
    await placeBid(item, Number(bidAmount), false);
  };

  const handleProxyBid = async (e) => {
    e.preventDefault();
    if (maxProxyAmount < minNextBid) {
      pushNotification(`⚠️ Giá trần Proxy tối thiểu phải từ ${minNextBid.toLocaleString()}đ!`, 'warning');
      return;
    }
    await placeBid(item, minNextBid, true, Number(maxProxyAmount));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Nút quay lại */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#161214',
            color: '#D4D4D8',
            border: '1px solid #2F2227',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Quay lại Sàn đấu giá
        </button>
      </div>

      {/* Khối 2 cột chính */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* CỘT TRÁI: Hình ảnh + Thông tin Người bán */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#161214',
              border: '1px solid #2A2024',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
            />

            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800'
              }}
            >
              {item.category}
            </span>

            {!isOwner && (
              <button
                type="button"
                onClick={() => toggleWatchlist(item)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backgroundColor: 'rgba(12, 10, 11, 0.85)',
                  color: isWatched ? '#FB7185' : '#FAFAFA',
                  border: '1px solid #38282E',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isWatched ? '❤️ Đang theo dõi' : '🤍 Theo dõi'}
              </button>
            )}
          </div>

          {/* Thẻ Người bán / Đơn vị ký gửi */}
          <div
            onClick={() => setIsSellerModalOpen(true)}
            title="Bấm để xem hồ sơ chi tiết, lịch sử và đánh giá"
            style={{
              backgroundColor: '#161214',
              border: '1px solid #2F2227',
              borderRadius: '14px',
              padding: '16px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#E11D48',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '18px'
                }}
              >
                {(item.seller?.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#A1A1AA' }}>
                  {isOwner ? 'Tài sản của bạn (Người đăng bán)' : 'Người bán / Đơn vị ký gửi'}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#FAFAFA' }}>
                  {item.seller?.name || 'Đối tác KYC'}
                </div>
                <div style={{ fontSize: '12px', color: '#FBBF24', marginTop: '2px' }}>
                  ★ {item.seller?.rating || 5.0} • {item.seller?.totalSales || 1} phiên thành công
                </div>
              </div>
            </div>

            <span style={{ fontSize: '12px', color: '#FB7185', fontWeight: '700' }}>
              Xem hồ sơ →
            </span>
          </div>
        </div>

        {/* CỘT PHẢI: Khu vực điều khiển (Tự động phân nhánh Người Bán vs Người Mua) */}
        <div
          style={{
            backgroundColor: '#161214',
            border: '1px solid #2A2024',
            borderRadius: '16px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: isEnded ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: isEnded ? '#F87171' : '#34D399',
                  border: isEnded ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                }}
              >
                {isEnded ? '🔴 PHIÊN ĐÃ KẾT THÚC' : '🟢 ĐANG DIỄN RA'}
              </span>

              {!isEnded && (
                <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '800', color: '#FBBF24' }}>
                  ⏳ {hours} : {minutes} : {seconds}
                </span>
              )}
            </div>

            <h1 style={{ margin: '10px 0 6px', fontSize: '22px', fontWeight: '800', color: '#FAFAFA' }}>
              {item.title}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#A1A1AA', lineHeight: '1.5' }}>
              {item.condition}
            </p>
          </div>

          {/* Khung giá hiện tại */}
          <div
            style={{
              backgroundColor: '#0C0A0B',
              border: '1px solid #2F2227',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#A1A1AA' }}>
                {isEnded ? 'Giá chốt phiên cuối cùng' : 'Giá trả cao nhất hiện tại'}
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#10B981', marginTop: '2px' }}>
                {item.currentPrice.toLocaleString()}đ
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA' }}>Bước giá tối thiểu</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#FB7185', marginTop: '2px' }}>
                +{(item.minStep || 500000).toLocaleString()}đ
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* NHÁNH 1: GIAO DIỆN DÀNH RIÊNG CHO NGƯỜI BÁN (CHỦ PHIÊN)    */}
          {/* ========================================================== */}
          {isOwner ? (
            <div
              style={{
                backgroundColor: '#0C0A0B',
                border: '1px solid #38282E',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#FB7185' }}>
                  🏪 BẢNG ĐIỀU KHIỂN CỦA NGƯỜI BÁN
                </span>
                <span style={{ fontSize: '12px', color: '#A1A1AA' }}>
                  {(item.bidHistory || []).length} lượt trả giá
                </span>
              </div>

              {!isEnded ? (
                <>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#D4D4D8', lineHeight: '1.5' }}>
                    Bạn là chủ sở hữu phiên đấu giá này. Hệ thống đang ghi nhận các lượt trả giá tự động theo thời gian thực.
                    {highestBid
                      ? ` Người đang dẫn đầu hiện tại là ${highestBid.bidder}.`
                      : ' Chưa có khách hàng nào đặt giá cho phiên này.'}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      style={{
                        flex: 1,
                        backgroundColor: '#231D20',
                        color: '#FAFAFA',
                        border: '1px solid #38282E',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      📊 Vào Quản lý phiên
                    </button>
                  </div>
                </>
              ) : highestBid && winnerProfile ? (
                /* KHI HẾT GIỜ VÀ CÓ NGƯỜI THẮNG: HIỆN NÚT XEM THÔNG TIN KHÁCH HÀNG */
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#34D399' }}>
                    🎉 Phiên đã chốt thành công với khách hàng: {winnerProfile.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#D4D4D8' }}>
                    Giá thắng cuộc: <strong>{highestBid.amount.toLocaleString()}đ</strong> • Đã xác thực thông tin giao nhận.
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsWinnerModalOpen(true)}
                    style={{
                      width: '100%',
                      backgroundColor: '#10B981',
                      color: '#052E16',
                      border: 'none',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    👤 Xem thông tin & Địa chỉ khách hàng thắng đấu giá
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#A1A1AA' }}>
                  Phiên đã kết thúc nhưng chưa có lượt trả giá nào. Bạn có thể đăng lại tài sản này trên sàn.
                </div>
              )}
            </div>
          ) : (
            /* ========================================================== */
            /* NHÁNH 2: GIAO DIỆN DÀNH CHO NGƯỜI MUA (THAM GIA ĐẤU GIÁ)   */
            /* ========================================================== */
            <>
              {item.requiresDeposit && !hasDeposited && !isEnded && (
                <div
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '12.5px', color: '#FBBF24', fontWeight: '700' }}>
                    🔒 Tài sản yêu cầu đặt cọc 10% ({(item.startingPrice * 0.1).toLocaleString()}đ)
                  </span>
                  <button
                    type="button"
                    onClick={() => openPaymentModal({ ...item, paymentType: 'deposit' })}
                    style={{
                      backgroundColor: '#F59E0B',
                      color: '#0C0A0B',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Nạp cọc ngay
                  </button>
                </div>
              )}

              {!isEnded ? (
                <>
                  {/* Tab chọn hình thức trả giá */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setBidTab('manual')}
                      style={modeBtnStyle(bidTab === 'manual')}
                    >
                      🔨 Trả giá trực tiếp
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidTab('proxy')}
                      style={modeBtnStyle(bidTab === 'proxy')}
                    >
                      🤖 Đấu giá tự động (Proxy)
                    </button>
                  </div>

                  {bidTab === 'manual' ? (
                    <form onSubmit={handleManualBid} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '12px', color: '#A1A1AA' }}>
                        Nhập số tiền muốn trả (Tối thiểu {minNextBid.toLocaleString()}đ):
                      </label>
                      <input
                        type="number"
                        step={item.minStep || 500000}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        style={inputStyle}
                      />
                      <button type="submit" style={primaryBtnStyle}>
                        Đặt giá {Number(bidAmount).toLocaleString()}đ
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleProxyBid} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '12px', color: '#A1A1AA' }}>
                        Nhập giá trần tối đa bạn sẵn sàng trả (Hệ thống tự nâng từng bước):
                      </label>
                      <input
                        type="number"
                        step={item.minStep || 500000}
                        value={maxProxyAmount}
                        onChange={(e) => setMaxProxyAmount(Number(e.target.value))}
                        style={inputStyle}
                      />
                      <button type="submit" style={primaryBtnStyle}>
                        🤖 Kích hoạt Proxy Bid (Trần {Number(maxProxyAmount).toLocaleString()}đ)
                      </button>
                    </form>
                  )}

                  {item.buyItNowPrice && (
                    <button
                      type="button"
                      onClick={() => buyItNow(item)}
                      style={{
                        backgroundColor: '#231D20',
                        color: '#FDA4AF',
                        border: '1px solid #E11D48',
                        padding: '11px',
                        borderRadius: '8px',
                        fontWeight: '800',
                        fontSize: '13.5px',
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ Mua ngay không cần chờ: {item.buyItNowPrice.toLocaleString()}đ
                    </button>
                  )}
                </>
              ) : (
                <div
                  style={{
                    backgroundColor: '#0C0A0B',
                    border: '1px solid #38282E',
                    borderRadius: '10px',
                    padding: '14px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FB7185' }}>
                    Phiên đấu giá đã kết thúc!
                  </div>
                  {highestBid && (
                    <div style={{ fontSize: '12.5px', color: '#D4D4D8', marginTop: '4px' }}>
                      Người thắng cuộc: <strong>{highestBid.bidder}</strong> ({highestBid.amount.toLocaleString()}đ)
                    </div>
                  )}

                  {isWinner ? (
                    <button
                      type="button"
                      onClick={() => openPaymentModal({ ...item, paymentType: 'escrow' })}
                      style={{ ...primaryBtnStyle, width: '100%', marginTop: '10px' }}
                    >
                      💳 Thanh toán Escrow đơn hàng thắng đấu giá
                    </button>
                  ) : highestBid ? (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#161214',
                        border: '1px solid #261D21',
                        fontSize: '12px',
                        color: '#A1A1AA',
                        lineHeight: '1.5'
                      }}
                    >
                      Tài sản đã thuộc về người trả giá cao nhất. Nếu bạn có đặt cọc trước đó, khoản cọc 10% đã được hoàn trả 100% về ví.
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}

          {/* Lịch sử trả giá trực tiếp (Dùng chung cho cả Người bán và Người mua) */}
          <div style={{ borderTop: '1px solid #261D21', paddingTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#FAFAFA', marginBottom: '10px' }}>
              📜 Lịch sử trả giá ({(item.bidHistory || []).length})
            </div>

            {!item.bidHistory || item.bidHistory.length === 0 ? (
              <p style={{ margin: 0, fontSize: '12.5px', color: '#71717A' }}>
                Chưa có lượt trả giá nào cho sản phẩm này.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '210px', overflowY: 'auto' }}>
                {item.bidHistory.map((b, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: idx === 0 ? 'rgba(16, 185, 129, 0.08)' : '#0C0A0B',
                      border: idx === 0 ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid #241B1F',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px'
                    }}
                  >
                    <div>
                      <strong style={{ color: idx === 0 ? '#34D399' : '#FAFAFA' }}>
                        {idx === 0 ? '👑 ' : ''}{b.bidder}
                      </strong>
                      <div style={{ fontSize: '11px', color: '#71717A' }}>{b.time}</div>
                    </div>
                    <strong style={{ color: idx === 0 ? '#10B981' : '#D4D4D8' }}>
                      {b.amount.toLocaleString()}đ
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal hồ sơ đơn vị ký gửi / người bán */}
      {isSellerModalOpen && (
        <SellerProfileModal
          seller={item.seller}
          onClose={() => setIsSellerModalOpen(false)}
        />
      )}

      {/* Modal thông tin & địa chỉ khách hàng thắng đấu giá dành cho Người Bán */}
      {isWinnerModalOpen && winnerProfile && (
        <WinnerContactModal
          winnerInfo={winnerProfile}
          product={item}
          onClose={() => setIsWinnerModalOpen(false)}
        />
      )}
    </div>
  );
}

const modeBtnStyle = (active) => ({
  flex: 1,
  padding: '9px 10px',
  borderRadius: '8px',
  border: active ? '1px solid #E11D48' : '1px solid #2F2227',
  backgroundColor: active ? 'rgba(225, 29, 72, 0.16)' : '#0C0A0B',
  color: active ? '#FB7185' : '#A1A1AA',
  fontSize: '12.5px',
  fontWeight: '700',
  cursor: 'pointer'
});

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #38282E',
  backgroundColor: '#0C0A0B',
  color: '#FAFAFA',
  fontSize: '14px',
  fontWeight: '700',
  boxSizing: 'border-box'
};

const primaryBtnStyle = {
  backgroundColor: '#E11D48',
  color: '#FFFFFF',
  border: 'none',
  padding: '12px',
  borderRadius: '8px',
  fontWeight: '800',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)'
};