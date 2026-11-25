import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuction } from '../context/AuctionContext';

const escrowActionSchema = yup.object({
  note: yup
    .string()
    .required('Vui lòng nhập nội dung chi tiết')
    .min(5, 'Nội dung tối thiểu 5 ký tự')
});

export default function UserDashboardPage() {
  const {
    user,
    products,
    watchlist,
    activeBids,
    openPaymentModal,
    openCreateModal,
    confirmDelivery,
    fileDispute
  } = useAuction();

  const [roleTab, setRoleTab] = useState('buyer'); // 'buyer' | 'seller'
  const [buyerSubTab, setBuyerSubTab] = useState('active'); // 'active' | 'watchlist' | 'won'
  const [now, setNow] = useState(() => Date.now());
  const [escrowModal, setEscrowModal] = useState(null); // { productId, title, mode: 'review' | 'dispute' }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(escrowActionSchema)
  });

  // Cập nhật thời gian mỗi giây để tự động chuyển phiên hết giờ từ "Đang tham gia" sang "Đã thắng"
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  // Dữ liệu Người Mua
  const watchlistItems = products.filter((p) => watchlist.includes(p.id));
  const activeBidItems = products.filter(
    (p) => activeBids[p.id] && new Date(p.endTime).getTime() > now
  );
  const wonItems = products.filter(
    (p) =>
      activeBids[p.id] &&
      new Date(p.endTime).getTime() <= now &&
      activeBids[p.id].amount >= p.currentPrice
  );

  // Dữ liệu Người Bán (chỉ lọc các sản phẩm thuộc user hiện tại)
  const sellerItems = products.filter((p) => p.sellerId === user.id);
  const totalRevenue = sellerItems.reduce((sum, item) => sum + item.currentPrice, 0);

  const openEscrowForm = (item, mode) => {
    setEscrowModal({ productId: item.id, title: item.title, mode });
    reset({
      note: mode === 'review' ? '5 sao - Hàng chuẩn chính hãng, giao nhanh!' : ''
    });
  };

  const onSubmitEscrowForm = (data) => {
    if (!escrowModal) return;
    if (escrowModal.mode === 'review') {
      confirmDelivery(escrowModal.productId, data.note);
    } else {
      fileDispute(escrowModal.productId, data.note);
    }
    setEscrowModal(null);
    reset();
  };

  return (
    <div style={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '14px', padding: '24px' }}>
      {/* Thanh trạng thái KYC & Ví đặt cọc */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #27272A', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#FAFAFA' }}>Trung tâm Quản lý Cá nhân</h2>
          {user.isKycVerified ? (
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #10B981' }}>
              ✓ Đã xác thực KYC ({user.cccd})
            </span>
          ) : (
            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid #EF4444' }}>
              ⚠ Chưa hoàn tất KYC
            </span>
          )}
        </div>

        <div style={{ fontSize: '14px', color: '#A1A1AA' }}>
          Số dư Ví Đặt Cọc: <strong style={{ color: '#EF4444', fontSize: '16px' }}>{user.walletBalance?.toLocaleString()}đ</strong>
        </div>
      </div>

      {/* Chuyển đổi vai trò Người Mua / Người Bán */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setRoleTab('buyer')} style={tabButtonStyle(roleTab === 'buyer')}>
          🛒 Quản lý Người Mua
        </button>
        <button onClick={() => setRoleTab('seller')} style={tabButtonStyle(roleTab === 'seller')}>
          🏪 Kênh Người Bán & Doanh Thu
        </button>
      </div>

      {/* GIAO DIỆN NGƯỜI MUA */}
      {roleTab === 'buyer' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setBuyerSubTab('active')} style={subTabStyle(buyerSubTab === 'active')}>
              Đang tham gia ({activeBidItems.length})
            </button>
            <button onClick={() => setBuyerSubTab('watchlist')} style={subTabStyle(buyerSubTab === 'watchlist')}>
              Đang theo dõi ({watchlistItems.length})
            </button>
            <button onClick={() => setBuyerSubTab('won')} style={subTabStyle(buyerSubTab === 'won')}>
              Đã thắng ({wonItems.length})
            </button>
          </div>

          {/* 1. Đang tham gia */}
          {buyerSubTab === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeBidItems.length === 0 ? (
                <p style={{ color: '#71717A', fontSize: '14px' }}>Bạn chưa tham gia trả giá phiên nào đang diễn ra.</p>
              ) : (
                activeBidItems.map((item) => {
                  const myBid = activeBids[item.id]?.amount || 0;
                  const isLeading = myBid >= item.currentPrice;
                  return (
                    <div key={item.id} style={rowStyle}>
                      <div>
                        <Link to={`/auction/${item.id}`} style={{ color: '#FAFAFA', textDecoration: 'none', fontWeight: '700' }}>
                          {item.title}
                        </Link>
                        <div style={{ fontSize: '12px', color: '#A1A1AA', marginTop: '4px' }}>
                          Giá bạn đặt: <strong style={{ color: '#FAFAFA' }}>{myBid.toLocaleString()}đ</strong> | Giá hiện tại: <strong style={{ color: '#EF4444' }}>{item.currentPrice.toLocaleString()}đ</strong>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', backgroundColor: isLeading ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: isLeading ? '#10B981' : '#EF4444' }}>
                          {isLeading ? '🏆 Đang dẫn đầu' : '⚠️ Đã bị vượt mặt'}
                        </span>
                        <Link to={`/auction/${item.id}`} style={{ ...actionBtn('#27272A', '#EF4444'), textDecoration: 'none', border: '1px solid #3F3F46' }}>
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 2. Đang theo dõi */}
          {buyerSubTab === 'watchlist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {watchlistItems.length === 0 ? (
                <p style={{ color: '#71717A', fontSize: '14px' }}>Danh sách theo dõi trống.</p>
              ) : (
                watchlistItems.map((item) => (
                  <div key={item.id} style={rowStyle}>
                    <span>
                      <Link to={`/auction/${item.id}`} style={{ color: '#FAFAFA', textDecoration: 'none', fontWeight: '700' }}>
                        {item.title}
                      </Link>{' '}
                      — <strong style={{ color: '#EF4444' }}>{item.currentPrice.toLocaleString()}đ</strong>
                    </span>
                    <Link to={`/auction/${item.id}`} style={{ ...actionBtn('#27272A', '#EF4444'), textDecoration: 'none', border: '1px solid #3F3F46' }}>
                      Xem phiên →
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. Đã thắng + Escrow + Đánh giá / Khiếu nại */}
          {buyerSubTab === 'won' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wonItems.length === 0 ? (
                <p style={{ color: '#71717A', fontSize: '14px' }}>Chưa có phiên đấu giá nào thắng cuộc.</p>
              ) : (
                wonItems.map((item) => (
                  <div key={item.id} style={rowStyle}>
                    <div>
                      <strong>{item.title}</strong>
                      <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>
                        Giá thắng: {item.currentPrice.toLocaleString()}đ • Trạng thái: <strong>{item.escrowStatus || 'Chờ thanh toán Escrow'}</strong>
                      </div>
                      {item.buyerReview && (
                        <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>
                          Đánh giá của bạn: "{item.buyerReview}"
                        </div>
                      )}
                      {item.disputeReason && (
                        <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>
                          Lý do khiếu nại: "{item.disputeReason}"
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {!item.escrowStatus && (
                        <button onClick={() => openPaymentModal({ ...item, paymentType: 'escrow' })} style={actionBtn('#EF4444', '#09090B')}>
                          Thanh toán Escrow
                        </button>
                      )}
                      {item.escrowStatus === 'Đang giữ tiền trung gian' && (
                        <>
                          <button onClick={() => openEscrowForm(item, 'review')} style={actionBtn('#10B981', '#09090B')}>
                            ✓ Đã nhận hàng & Đánh giá
                          </button>
                          <button onClick={() => openEscrowForm(item, 'dispute')} style={actionBtn('#EF4444', '#FAFAFA')}>
                            ⚖️ Khiếu nại
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* GIAO DIỆN NGƯỜI BÁN */}
      {roleTab === 'seller' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#09090B', padding: '16px', borderRadius: '8px', border: '1px solid #27272A' }}>
              <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Tổng doanh thu dự kiến</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>{totalRevenue.toLocaleString()}đ</div>
            </div>
            <div style={{ backgroundColor: '#09090B', padding: '16px', borderRadius: '8px', border: '1px solid #27272A' }}>
              <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Phiên đang quản lý</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#EF4444', marginTop: '4px' }}>{sellerItems.length} sản phẩm</div>
            </div>
          </div>

          <button onClick={openCreateModal} style={{ backgroundColor: '#EF4444', color: '#FFFFFF', fontWeight: '800', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
            + Tạo phiên đấu giá mới (Có Mua Ngay & Bước giá)
          </button>

          {sellerItems.length === 0 ? (
            <p style={{ color: '#71717A', fontSize: '14px' }}>Bạn chưa đăng bán sản phẩm đấu giá nào.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sellerItems.map((item) => (
                <div key={item.id} style={rowStyle}>
                  <div>
                    <Link to={`/auction/${item.id}`} style={{ color: '#FAFAFA', textDecoration: 'none', fontWeight: '700' }}>
                      {item.title}
                    </Link>
                    <div style={{ fontSize: '12px', color: '#A1A1AA', marginTop: '2px' }}>
                      Lượt trả giá: {item.bidHistory?.length || 0} • Trạng thái Escrow: {item.escrowStatus || 'Đang đấu giá'}
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#D4D4D8' }}>
                    Giá hiện tại: <strong style={{ color: '#10B981' }}>{item.currentPrice.toLocaleString()}đ</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Đánh giá hoặc Khiếu nại Escrow (React Hook Form + Yup) */}
      {escrowModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '16px' }}>
          <div style={{ backgroundColor: '#18181B', border: '1px solid #3F3F46', borderRadius: '14px', maxWidth: '440px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: escrowModal.mode === 'review' ? '#10B981' : '#EF4444' }}>
              {escrowModal.mode === 'review' ? '⭐ Xác nhận nhận hàng & Đánh giá' : '⚖️ Mở khiếu nại Trọng tài Escrow'}
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#A1A1AA' }}>
              Sản phẩm: <strong style={{ color: '#FAFAFA' }}>{escrowModal.title}</strong>
            </p>

            <form onSubmit={handleSubmit(onSubmitEscrowForm)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                rows={3}
                {...register('note')}
                placeholder={
                  escrowModal.mode === 'review'
                    ? 'Nhập số sao (1-5) và nhận xét về chất lượng sản phẩm...'
                    : 'Mô tả chi tiết lý do khiếu nại (hàng lỗi, sai mô tả...) để phong tỏa tiền...'
                }
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #3F3F46', backgroundColor: '#09090B', color: '#FAFAFA', fontSize: '13px', boxSizing: 'border-box' }}
              />
              {errors.note && <div style={{ color: '#EF4444', fontSize: '11px' }}>{errors.note.message}</div>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setEscrowModal(null)} style={actionBtn('#27272A', '#A1A1AA')}>
                  Hủy
                </button>
                <button
                  type="submit"
                  style={actionBtn(escrowModal.mode === 'review' ? '#10B981' : '#EF4444', escrowModal.mode === 'review' ? '#09090B' : '#FAFAFA')}
                >
                  {escrowModal.mode === 'review' ? 'Xác nhận & Giải ngân' : 'Gửi khiếu nại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const tabButtonStyle = (active) => ({
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: active ? '#EF4444' : '#27272A',
  color: active ? '#09090B' : '#A1A1AA'
});

const subTabStyle = (active) => ({
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  border: active ? '1px solid #EF4444' : '1px solid #3F3F46',
  backgroundColor: active ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
  color: active ? '#EF4444' : '#A1A1AA'
});

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px',
  backgroundColor: '#09090B',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #27272A'
};

const actionBtn = (bg, color) => ({
  backgroundColor: bg,
  color,
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer'
});