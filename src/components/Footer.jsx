import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LEGAL_DOCS = {
  terms: {
    title: 'Điều khoản & Quy chế Đấu giá Trực tuyến',
    updated: 'Cập nhật: 11/2026',
    sections: [
      {
        heading: '1. Điều kiện tham gia trả giá',
        content:
          'Người tham gia đấu giá phải đăng ký tài khoản hợp lệ và hoàn tất xác thực danh tính (KYC) theo quy định. Đối với các tài sản giá trị cao có gắn nhãn yêu cầu đặt cọc, người mua cần nạp trước 10% giá trị khởi điểm/hiện tại để mở khóa quyền trả giá.'
      },
      {
        heading: '2. Cơ chế trả giá & Đấu giá tự động (Proxy Bid)',
        content:
          'Mỗi lượt trả giá phải cao hơn giá hiện tại tối thiểu bằng một bước giá quy định. Khi kích hoạt Proxy Bid, hệ thống sẽ tự động thay mặt bạn nâng giá từng bước nhỏ nhất cho đến khi chạm mức giá trần tối đa bạn đã thiết lập.'
      },
      {
        heading: '3. Nghĩa vụ thanh toán khi thắng cuộc',
        content:
          'Người trả giá cao nhất tại thời điểm đồng hồ đếm ngược kết thúc (hoặc người bấm Chốt Mua Ngay) là người thắng cuộc và có trách nhiệm thanh toán đầy đủ giá trị tài sản qua cổng Escrow trong vòng 24 giờ.'
      }
    ]
  },
  escrow: {
    title: 'Chính sách Bảo vệ Người mua & Thanh toán Trung gian (Escrow)',
    updated: 'Cập nhật: 11/2026',
    sections: [
      {
        heading: '1. Cơ chế giữ tiền trung gian an toàn',
        content:
          'Toàn bộ khoản thanh toán của người thắng đấu giá được hệ thống NQH Escrow tạm giữ an toàn. Người bán chỉ nhận được giải ngân sau khi người mua xác nhận đã nhận đúng hàng và kiểm định chất lượng.'
      },
      {
        heading: '2. Kiểm định & Hoàn trả tiền cọc',
        content:
          'Người tham gia không thắng cuộc sẽ được hoàn trả 100% tiền đặt cọc vào Ví Đặt Cọc ngay sau khi phiên đấu giá khép lại. Trường hợp người thắng cố tình từ chối thanh toán, khoản cọc sẽ bị khấu trừ để bồi thường cho người bán.'
      },
      {
        heading: '3. Giải quyết tranh chấp & Khiếu nại',
        content:
          'Nếu sản phẩm nhận được sai mô tả hoặc không đúng cam kết kiểm định, người mua có quyền mở Khiếu nại Trọng tài trong Trung tâm Quản lý Cá nhân để phong tỏa khoản tiền Escrow và được hoàn tiền 100%.'
      }
    ]
  },
  privacy: {
    title: 'Chính sách Bảo mật & Xác thực KYC',
    updated: 'Cập nhật: 11/2026',
    sections: [
      {
        heading: '1. Thu thập và mã hóa dữ liệu KYC',
        content:
          'Thông tin định danh cá nhân (Họ tên, Email, Số CCCD) chỉ được sử dụng cho mục đích xác minh tính minh bạch của các phiên đấu giá và phòng chống gian lận đẩy giá ảo.'
      },
      {
        heading: '2. Bảo vệ quyền riêng tư giao dịch',
        content:
          'NQH Auction cam kết không chia sẻ, mua bán dữ liệu cá nhân của khách hàng cho bên thứ ba dưới bất kỳ hình thức nào, ngoại trừ trường hợp có yêu cầu bằng văn bản từ cơ quan pháp luật có thẩm quyền.'
      }
    ]
  },
  fee: {
    title: 'Biểu phí Sàn & Quy định Ký gửi Tài sản',
    updated: 'Cập nhật: 11/2026',
    sections: [
      {
        heading: '1. Phí dành cho Người mua',
        content:
          'Miễn phí 100% phí đăng ký tài khoản, phí theo dõi phiên (Watchlist) và phí đặt giá tự động Proxy Bid.'
      },
      {
        heading: '2. Phí hoa hồng dành cho Người bán',
        content:
          'Phí dịch vụ sàn chỉ thu 3.5% trên tổng giá trị giao dịch thành công (đã bao gồm chi phí bảo vệ trung gian Escrow và hỗ trợ kiểm định cơ bản). Không thu phí nếu phiên đấu giá không có người trả giá.'
      }
    ]
  }
};

export default function Footer() {
  const [activeDocKey, setActiveDocKey] = useState(null);
  const currentDoc = activeDocKey ? LEGAL_DOCS[activeDocKey] : null;

  return (
    <>
      <footer
        style={{
          backgroundColor: '#120E10',
          borderTop: '1px solid #2A2024',
          marginTop: '48px',
          color: '#A1A1AA'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '44px 16px 28px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '32px'
          }}
        >
          {/* Cột 1: Thương hiệu & Giới thiệu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '14px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.5px'
                }}
              >
                NQH
              </span>
              <span style={{ fontWeight: '800', fontSize: '17px', color: '#FAFAFA', letterSpacing: '0.5px' }}>
                NQH AUCTION
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#A1A1AA' }}>
              Nền tảng đấu giá trực tuyến tài sản cao cấp, đồng hồ chính hãng, công nghệ và cổ vật độc bản. Minh bạch theo thời gian thực và bảo vệ giao dịch qua Escrow.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={badgeStyle}>🛡️ Escrow 100%</span>
              <span style={badgeStyle}>✓ Xác thực KYC</span>
            </div>
          </div>

          {/* Cột 2: Điều khoản & Chính sách (Bấm để xem chi tiết) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={headingStyle}>Điều khoản & Chính sách</h4>
            <button type="button" onClick={() => setActiveDocKey('terms')} style={linkBtnStyle}>
              Điều khoản & Quy chế đấu giá
            </button>
            <button type="button" onClick={() => setActiveDocKey('escrow')} style={linkBtnStyle}>
              Chính sách bảo vệ Escrow & Hoàn cọc
            </button>
            <button type="button" onClick={() => setActiveDocKey('privacy')} style={linkBtnStyle}>
              Chính sách bảo mật & Xác thực KYC
            </button>
            <button type="button" onClick={() => setActiveDocKey('fee')} style={linkBtnStyle}>
              Biểu phí sàn & Quy định ký gửi
            </button>
          </div>

          {/* Cột 3: Điều hướng nhanh */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={headingStyle}>Danh mục nổi bật</h4>
            <Link to="/" style={anchorStyle}>🏛️ Tất cả phiên đấu giá</Link>
            <Link to="/?category=Đồng hồ" style={anchorStyle}>⌚ Đồng hồ & Trang sức</Link>
            <Link to="/?category=Điện tử" style={anchorStyle}>💻 Thiết bị công nghệ</Link>
            <Link to="/?category=Đồ cổ / Nghệ thuật" style={anchorStyle}>🏺 Đồ cổ & Nghệ thuật</Link>
          </div>

          {/* Cột 4: Thông tin liên hệ & Hỗ trợ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={headingStyle}>Thông tin liên hệ</h4>
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#D4D4D8' }}>
              <div>📍 Tầng 3, Tòa nhà NQH Tower, 243 Xô Viết Tĩnh, TP. Đà Nẵng</div>
              <div style={{ marginTop: '6px' }}>
                📞 Hotline hỗ trợ: <strong style={{ color: '#FB7185' }}>1900 6868</strong>
              </div>
              <div style={{ marginTop: '4px' }}>
                ✉️ Email: <span style={{ color: '#FAFAFA' }}>support@nqh-auction.vn</span>
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#A1A1AA' }}>
                🕒 Trực tổng đài & Trọng tài Escrow: 08:00 – 22:00 hàng ngày
              </div>
            </div>
          </div>
        </div>

        {/* Thanh bản quyền dưới cùng */}
        <div
          style={{
            borderTop: '1px solid #221A1E',
            padding: '16px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#71717A'
          }}
        >
          © 2026 <strong style={{ color: '#D4D4D8' }}>NQH Auction Platform</strong>. Bảo lưu mọi quyền. Tuân thủ quy định thương mại điện tử & đấu giá trực tuyến.
        </div>
      </footer>

      {/* Modal đọc chi tiết Điều khoản & Chính sách */}
      {currentDoc && (
        <div
          onClick={() => setActiveDocKey(null)}
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
              borderRadius: '14px',
              maxWidth: '580px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)'
            }}
          >
            <div
              style={{
                backgroundColor: '#0E0B0C',
                padding: '18px 22px',
                borderBottom: '1px solid #2A2024',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#FAFAFA' }}>
                  {currentDoc.title}
                </h3>
                <span style={{ fontSize: '11px', color: '#FB7185' }}>{currentDoc.updated}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveDocKey(null)}
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

            <div
              style={{
                padding: '20px 22px',
                maxHeight: '65vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {currentDoc.sections.map((sec, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#0E0B0C',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #261D21'
                  }}
                >
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FB7185', marginBottom: '6px' }}>
                    {sec.heading}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#D4D4D8', lineHeight: '1.6' }}>
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '14px 22px',
                borderTop: '1px solid #2A2024',
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: '#0E0B0C'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveDocKey(null)}
                style={{
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const headingStyle = {
  margin: '0 0 4px 0',
  fontSize: '14px',
  fontWeight: '700',
  color: '#FAFAFA',
  letterSpacing: '0.2px'
};

const badgeStyle = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#FDA4AF',
  backgroundColor: 'rgba(225, 29, 72, 0.12)',
  border: '1px solid rgba(225, 29, 72, 0.35)',
  padding: '4px 10px',
  borderRadius: '6px'
};

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  textAlign: 'left',
  color: '#A1A1AA',
  fontSize: '13px',
  cursor: 'pointer'
};

const anchorStyle = {
  textDecoration: 'none',
  color: '#A1A1AA',
  fontSize: '13px'
};