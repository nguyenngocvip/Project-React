import React, { useState, useEffect, useRef } from 'react';
import { useAuction } from '../context/AuctionContext';
import AuctionCard from '../components/AuctionCard';

const CATEGORIES = ['Tất cả', 'Điện tử', 'Đồng hồ', 'Đồ cổ / Nghệ thuật', 'Xe cộ'];
const ITEMS_PER_VIEW = 3;
const GAP_PX = 20;

export default function MarketplacePage() {
  const { products, user, openCreateModal, openLoginModal } = useAuction();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const isAnimatingRef = useRef(false);

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_VIEW));
  const hasCarousel = totalItems > ITEMS_PER_VIEW;

  // Nhân đôi danh sách để trượt vòng tròn vô tận không bị giật ngược
  const trackItems = hasCarousel
    ? [...filteredProducts, ...filteredProducts]
    : filteredProducts;

  // Reset về đầu khi đổi từ khóa tìm kiếm hoặc danh mục
  useEffect(() => {
    setIsTransitioning(false);
    setCurrentIndex(0);
    isAnimatingRef.current = false;
  }, [searchTerm, selectedCategory]);

  // Hàm trượt tới vị trí targetIndex có hiệu ứng mượt
  const slideTo = (targetIndex) => {
    if (!hasCarousel || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex(targetIndex);
  };

  // Tự động trượt qua 1 sản phẩm tiếp theo sau mỗi 5 giây
  useEffect(() => {
    if (!hasCarousel || isPaused) return;

    const timer = setInterval(() => {
      slideTo(currentIndex + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasCarousel, isPaused, currentIndex, totalItems]);

  // Xử lý ngay khi hiệu ứng CSS transition kết thúc để vòng lặp liền mạch
  const handleTransitionEnd = () => {
    isAnimatingRef.current = false;
    if (currentIndex >= totalItems) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex % totalItems);
    }
  };

  // Bấm mũi tên phải: trượt mượt sang trang 3 sản phẩm tiếp theo
  const handleNextPage = () => {
    slideTo(currentIndex + ITEMS_PER_VIEW);
  };

  // Bấm mũi tên trái: trượt mượt lùi về trang 3 sản phẩm trước đó
  const handlePrevPage = () => {
    if (!hasCarousel || isAnimatingRef.current) return;
    if (currentIndex - ITEMS_PER_VIEW < 0) {
      // Nhảy ngầm sang bản sao phía sau rồi trượt lùi mượt mà
      setIsTransitioning(false);
      const jumpedIndex = currentIndex + totalItems;
      setCurrentIndex(jumpedIndex);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isAnimatingRef.current = true;
          setIsTransitioning(true);
          setCurrentIndex(jumpedIndex - ITEMS_PER_VIEW);
        });
      });
    } else {
      slideTo(currentIndex - ITEMS_PER_VIEW);
    }
  };

  // Bấm chọn số trang (1, 2, 3...)
  const handleSelectPage = (pageIdx) => {
    const target = pageIdx * ITEMS_PER_VIEW;
    if (target === currentIndex % totalItems) return;
    slideTo(target);
  };

  const normalizedIndex = totalItems > 0 ? currentIndex % totalItems : 0;
  const currentPage = Math.floor(normalizedIndex / ITEMS_PER_VIEW);

  // Công thức tính chính xác khoảng cách trượt theo tỷ lệ 3 cột + khoảng hở 20px
  const translateValue = `calc(-${currentIndex} * ((100% + ${GAP_PX}px) / ${ITEMS_PER_VIEW}))`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Thanh tìm kiếm, lọc danh mục & nút đăng bán */}
      <div
        style={{
          backgroundColor: '#161214',
          border: '1px solid #2A2024',
          borderRadius: '14px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Tìm kiếm đồng hồ Rolex, MacBook Pro, gốm Chu Đậu..."
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #38282E',
              backgroundColor: '#0C0A0B',
              color: '#FAFAFA',
              fontSize: '13.5px',
              outline: 'none'
            }}
          />

          <button
            type="button"
            onClick={() => (user ? openCreateModal() : openLoginModal())}
            style={{
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
            }}
          >
            + Đăng tài sản đấu giá
          </button>
        </div>

        {/* Bộ lọc danh mục */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: active ? '1px solid #E11D48' : '1px solid #2F2227',
                    backgroundColor: active ? 'rgba(225, 29, 72, 0.16)' : '#0C0A0B',
                    color: active ? '#FB7185' : '#A1A1AA',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>
            Hiển thị <strong style={{ color: '#FAFAFA' }}>{Math.min(ITEMS_PER_VIEW, totalItems)}</strong> /{' '}
            <strong style={{ color: '#FB7185' }}>{totalItems}</strong> phiên •{' '}
            <span style={{ color: isPaused ? '#FBBF24' : '#34D399' }}>
              {isPaused ? '⏸ Đang tạm dừng trượt' : '▶ Tự động trượt mượt 5s'}
            </span>
          </span>
        </div>
      </div>

      {/* Khu vực Carousel trượt ngang mượt mà + 2 nút mũi tên 2 bên */}
      {totalItems === 0 ? (
        <div
          style={{
            backgroundColor: '#161214',
            border: '1px solid #2A2024',
            borderRadius: '14px',
            padding: '48px 20px',
            textAlign: 'center',
            color: '#A1A1AA'
          }}
        >
          Không tìm thấy phiên đấu giá nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          {/* Nút mũi tên Trái (Lùi mượt 3 sản phẩm) */}
          {hasCarousel && (
            <button
              type="button"
              onClick={handlePrevPage}
              title="Trang 3 sản phẩm trước"
              style={arrowBtnStyle}
            >
              &#10094;
            </button>
          )}

          {/* Khung cắt (Viewport) giữ đúng 3 thẻ sản phẩm */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '4px 0' }}>
            <div
              onTransitionEnd={handleTransitionEnd}
              style={{
                display: 'flex',
                gap: `${GAP_PX}px`,
                transform: hasCarousel ? `translateX(${translateValue})` : 'none',
                transition: isTransitioning
                  ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                  : 'none',
                willChange: 'transform'
              }}
            >
              {trackItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  style={{
                    flex: `0 0 calc((100% - ${(ITEMS_PER_VIEW - 1) * GAP_PX}px) / ${ITEMS_PER_VIEW})`,
                    minWidth: 0,
                    display: 'flex'
                  }}
                >
                  <AuctionCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Nút mũi tên Phải (Tiến mượt 3 sản phẩm) */}
          {hasCarousel && (
            <button
              type="button"
              onClick={handleNextPage}
              title="Trang 3 sản phẩm tiếp theo"
              style={arrowBtnStyle}
            >
              &#10095;
            </button>
          )}
        </div>
      )}

      {/* Thanh phân trang số trang ở bên dưới */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px'
          }}
        >
          {Array.from({ length: totalPages }, (_, pageIdx) => {
            const isActive = currentPage === pageIdx;
            return (
              <button
                key={pageIdx}
                type="button"
                onClick={() => handleSelectPage(pageIdx)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #E11D48' : '1px solid #38282E',
                  backgroundColor: isActive ? '#E11D48' : '#161214',
                  color: isActive ? '#FFFFFF' : '#A1A1AA',
                  fontWeight: '800',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(225, 29, 72, 0.4)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {pageIdx + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const arrowBtnStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  border: '1px solid #38282E',
  backgroundColor: '#161214',
  color: '#FB7185',
  fontSize: '18px',
  fontWeight: '900',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.6)',
  transition: 'all 0.2s ease'
};