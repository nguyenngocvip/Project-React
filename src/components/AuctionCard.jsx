import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuction } from '../context/AuctionContext';
import CountdownTimer from './CountdownTimer';

export default function AuctionCard({ item }) {
  const {
    user,
    watchlist,
    depositedIds,
    toggleWatchlist,
    placeBid,
    openLoginModal,
    openPaymentModal,
    pushNotification
  } = useAuction();

  const [isEnded, setIsEnded] = useState(() => new Date(item.endTime).getTime() <= Date.now());
  const minStep = item.minStep || 50000;
  const nextMinBid = item.currentPrice + minStep;

  const isWatched = watchlist.includes(item.id);
  const needsDeposit = item.requiresDeposit && !depositedIds.includes(item.id);
  const bidCount = item.bidHistory?.length || 0;

  const seller = item.seller || {
    name: 'Luxury Store VN',
    rating: 4.9
  };

  const handleExpire = useCallback(() => {
    setIsEnded(true);
  }, []);

  const handleQuickBid = () => {
    if (!user) return openLoginModal();
    if (isEnded) {
      pushNotification('Phiên đấu giá này đã kết thúc!', 'warning');
      return;
    }
    placeBid(item, nextMinBid, false);
  };

  return (
    <div
      style={{
        backgroundColor: '#161315',
        borderRadius: '14px',
        border: '1px solid #2A2226',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        transition: 'transform 0.2s ease'
      }}
    >
      {/* Khu vực hình ảnh */}
      <div style={{ position: 'relative', height: '215px', backgroundColor: '#0C0A0B' }}>
        <Link to={`/auction/${item.id}`}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Link>

        {/* Nút Theo dõi */}
        <button
          onClick={() => toggleWatchlist(item)}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(12, 10, 11, 0.8)',
            backdropFilter: 'blur(6px)',
            color: isWatched ? '#F43F5E' : '#F4F4F5',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: '5px 11px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {isWatched ? '❤️ Đã lưu' : '🤍 Theo dõi'}
        </button>

        {/* Đồng hồ đếm ngược */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(12, 10, 11, 0.85)',
            backdropFilter: 'blur(6px)',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(225, 29, 72, 0.4)'
          }}
        >
          <CountdownTimer targetDate={item.endTime} onExpire={handleExpire} />
        </div>

        {/* Badge danh mục */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: '#E11D48',
            color: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.3px'
          }}
        >
          {item.category}
        </div>
      </div>

      {/* Nội dung thẻ */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        <div>
          <Link to={`/auction/${item.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#FAFAFA', lineHeight: '1.4' }}>
              {item.title}
            </h3>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#A1A1AA' }}>
            <span>Người bán: <strong style={{ color: '#E4E4E7' }}>{seller.name}</strong></span>
            <span>⭐ {seller.rating} • {bidCount} lượt giá</span>
          </div>
        </div>

        {/* Cảnh báo cọc gọn nhẹ */}
        {needsDeposit && !isEnded && (
          <div
            style={{
              backgroundColor: 'rgba(225, 29, 72, 0.12)',
              border: '1px solid rgba(225, 29, 72, 0.4)',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#FDA4AF'
            }}
          >
            <span>🔒 Yêu cầu cọc 10%</span>
            <button
              onClick={() => (user ? openPaymentModal({ ...item, paymentType: 'deposit' }) : openLoginModal())}
              style={{
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '5px',
                fontWeight: '700',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Nạp cọc
            </button>
          </div>
        )}

        {/* Khối giá hiện tại */}
        <div
          style={{
            backgroundColor: '#0C0A0B',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #261E22',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#A1A1AA', marginBottom: '2px' }}>Giá hiện tại</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#FAFAFA' }}>
              {item.currentPrice.toLocaleString()}đ
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#A1A1AA', marginBottom: '2px' }}>Bước giá</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#FB7185' }}>
              +{minStep.toLocaleString()}đ
            </div>
          </div>
        </div>

        {/* Cụm nút hành động chính */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          {!isEnded ? (
            <>
              <button
                type="button"
                onClick={handleQuickBid}
                style={{
                  flex: 2,
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
                }}
              >
                Trả giá {nextMinBid.toLocaleString()}đ
              </button>
              <Link
                to={`/auction/${item.id}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#231D20',
                  color: '#F4F4F5',
                  border: '1px solid #382E33',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                Chi tiết
              </Link>
            </>
          ) : (
            <Link
              to={`/auction/${item.id}`}
              style={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: '#231D20',
                color: '#FDA4AF',
                border: '1px solid rgba(225, 29, 72, 0.4)',
                fontWeight: '700',
                padding: '11px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px'
              }}
            >
              Xem kết quả phiên đấu giá
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}