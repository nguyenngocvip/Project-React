export const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'Đồng hồ Rolex Submariner Date 2022',
    category: 'Đồng hồ',
    startingPrice: 280000000,
    currentPrice: 310000000,
    minStep: 2000000,
    buyItNowPrice: 380000000,
    requiresDeposit: true,
    condition: 'Mới 99% - Fullbox hộp sổ thẻ bảo hành chính hãng 2022.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',
    endTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    seller: { name: 'Luxury Watch VN', rating: 4.9, totalSales: 142 },
    bidHistory: [
      { bidder: 'Trần Minh K***', amount: 310000000, time: '10 phút trước' },
      { bidder: 'Lê Hoàng N***', amount: 308000000, time: '25 phút trước' },
      { bidder: 'Phạm Quốc B***', amount: 300000000, time: '1 giờ trước' }
    ]
  },
  {
    id: 2,
    title: 'MacBook Pro 16-inch M3 Max 64GB/2TB',
    category: 'Điện tử',
    startingPrice: 65000000,
    currentPrice: 72000000,
    minStep: 1000000,
    buyItNowPrice: 89000000,
    requiresDeposit: true,
    condition: 'Like New 99.9% - Sạc 8 lần, AppleCare+ đến 2027.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    endTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    seller: { name: 'MacStore Saigon', rating: 4.8, totalSales: 96 },
    bidHistory: [
      { bidder: 'Nguyễn Thảo V***', amount: 72000000, time: '5 phút trước' },
      { bidder: 'Vũ Hải Đ***', amount: 71000000, time: '40 phút trước' }
    ]
  },
  {
    id: 3,
    title: 'Bình gốm Chu Đậu vẽ vàng 24K nghệ nhân',
    category: 'Đồ cổ / Nghệ thuật',
    startingPrice: 15000000,
    currentPrice: 18500000,
    minStep: 500000,
    buyItNowPrice: 28000000,
    requiresDeposit: false,
    condition: 'Nguyên bản 100% - Kèm chứng thư nghệ nhân chế tác.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600',
    endTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    seller: { name: 'Di Sản Việt Gallery', rating: 5.0, totalSales: 64 },
    bidHistory: [
      { bidder: 'Bùi Thanh T***', amount: 18500000, time: '12 phút trước' },
      { bidder: 'Đặng Ngọc A***', amount: 18000000, time: '50 phút trước' },
      { bidder: 'Hoàng Gia H***', amount: 17000000, time: '2 giờ trước' },
      { bidder: 'Trần Minh K***', amount: 16500000, time: '3 giờ trước' }
    ]
  },
  {
    id: 4,
    title: 'Máy ảnh Leica Q3 Full-Frame 60MP',
    category: 'Điện tử',
    startingPrice: 120000000,
    currentPrice: 132000000,
    minStep: 2000000,
    buyItNowPrice: 155000000,
    requiresDeposit: true,
    condition: 'Mới 98% - Đầy đủ hộp zin, pin phụ và hood kim loại.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    seller: { name: 'Leica Corner VN', rating: 4.9, totalSales: 83 },
    bidHistory: [
      { bidder: 'Lê Hoàng N***', amount: 132000000, time: '8 phút trước' },
      { bidder: 'Nguyễn Thảo V***', amount: 130000000, time: '32 phút trước' },
      { bidder: 'Phạm Quốc B***', amount: 128000000, time: '1 giờ trước' }
    ]
  },
  {
    id: 5,
    title: 'Đồng hồ Omega Speedmaster Moonwatch',
    category: 'Đồng hồ',
    startingPrice: 135000000,
    currentPrice: 145000000,
    minStep: 1500000,
    buyItNowPrice: 175000000,
    requiresDeposit: true,
    condition: 'Mới 99% - Bản Sapphire Sandwich, fullbox 2023.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600',
    endTime: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    seller: { name: 'Luxury Watch VN', rating: 4.9, totalSales: 142 },
    bidHistory: [
      { bidder: 'Vũ Hải Đ***', amount: 145000000, time: '15 phút trước' },
      { bidder: 'Trần Minh K***', amount: 143500000, time: '45 phút trước' }
    ]
  },
  {
    id: 6,
    title: 'Xe Vespa 946 Christian Dior Limited Edition',
    category: 'Xe cộ',
    startingPrice: 450000000,
    currentPrice: 495000000,
    minStep: 5000000,
    buyItNowPrice: 590000000,
    requiresDeposit: true,
    condition: 'Odo 320km - Hải quan chính ngạch, kèm cốp sau & mũ Dior.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600',
    endTime: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    seller: { name: 'Classic Moto Collector', rating: 5.0, totalSales: 31 },
    bidHistory: [
      { bidder: 'Hoàng Gia H***', amount: 495000000, time: '3 phút trước' },
      { bidder: 'Đặng Ngọc A***', amount: 490000000, time: '20 phút trước' },
      { bidder: 'Bùi Thanh T***', amount: 480000000, time: '1 giờ trước' },
      { bidder: 'Lê Hoàng N***', amount: 475000000, time: '2 giờ trước' },
      { bidder: 'Trần Minh K***', amount: 465000000, time: '4 giờ trước' }
    ]
  },
  {
    id: 7,
    title: 'Tranh sơn mài phố cổ Hà Nội khổ lớn',
    category: 'Đồ cổ / Nghệ thuật',
    startingPrice: 25000000,
    currentPrice: 29000000,
    minStep: 1000000,
    buyItNowPrice: 45000000,
    requiresDeposit: false,
    condition: 'Sơn mài truyền thống dát vàng, kích thước 90x120cm.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600',
    endTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    seller: { name: 'Di Sản Việt Gallery', rating: 5.0, totalSales: 64 },
    bidHistory: [
      { bidder: 'Đặng Ngọc A***', amount: 29000000, time: '18 phút trước' },
      { bidder: 'Nguyễn Thảo V***', amount: 28000000, time: '55 phút trước' },
      { bidder: 'Bùi Thanh T***', amount: 27000000, time: '2 giờ trước' }
    ]
  },
  {
    id: 8,
    title: 'iPhone 16 Pro Max 1TB Titan Sa Mạc VN/A',
    category: 'Điện tử',
    startingPrice: 32000000,
    currentPrice: 35500000,
    minStep: 500000,
    buyItNowPrice: 42000000,
    requiresDeposit: false,
    condition: 'Nguyên seal chưa kích hoạt - Bảo hành chính hãng 12 tháng.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
    endTime: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    seller: { name: 'MacStore Saigon', rating: 4.8, totalSales: 96 },
    bidHistory: [
      { bidder: 'Phạm Quốc B***', amount: 35500000, time: '6 phút trước' },
      { bidder: 'Vũ Hải Đ***', amount: 35000000, time: '30 phút trước' },
      { bidder: 'Lê Hoàng N***', amount: 34500000, time: '1 giờ trước' },
      { bidder: 'Trần Minh K***', amount: 34000000, time: '2 giờ trước' }
    ]
  },
  {
    id: 9,
    title: 'Đồng hồ Cartier Tank Must Large Steel',
    category: 'Đồng hồ',
    startingPrice: 78000000,
    currentPrice: 84000000,
    minStep: 1000000,
    buyItNowPrice: 105000000,
    requiresDeposit: true,
    condition: 'Mới 98.5% - Dây da cá sấu zin, khóa gập chính hãng.',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600',
    endTime: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
    seller: { name: 'Luxury Watch VN', rating: 4.9, totalSales: 142 },
    bidHistory: [
      { bidder: 'Nguyễn Thảo V***', amount: 84000000, time: '9 phút trước' },
      { bidder: 'Hoàng Gia H***', amount: 83000000, time: '42 phút trước' },
      { bidder: 'Bùi Thanh T***', amount: 82000000, time: '2 giờ trước' }
    ]
  }
];