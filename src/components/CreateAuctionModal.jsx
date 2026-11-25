import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuction } from '../context/AuctionContext';

const createAuctionSchema = yup.object({
  title: yup.string().required('Vui lòng nhập tên sản phẩm').min(5, 'Tên sản phẩm tối thiểu 5 ký tự'),
  category: yup.string().required('Vui lòng chọn danh mục'),
  startingPrice: yup
    .number()
    .typeError('Giá khởi điểm phải là số')
    .required('Vui lòng nhập giá khởi điểm')
    .min(100000, 'Giá khởi điểm tối thiểu 100.000đ'),
  minStep: yup
    .number()
    .typeError('Bước giá phải là số')
    .required('Vui lòng nhập bước giá')
    .min(10000, 'Bước giá tối thiểu 10.000đ'),
  buyItNowPrice: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .moreThan(yup.ref('startingPrice'), 'Giá mua ngay phải cao hơn giá khởi điểm'),
  durationHours: yup.string().required(),
  requiresDeposit: yup.boolean(),
  condition: yup.string().required('Vui lòng mô tả tình trạng sản phẩm'),
  image: yup.string().url('Đường dẫn ảnh phải là URL hợp lệ').nullable()
});

export default function CreateAuctionModal() {
  const { modals, closeCreateModal, addProduct } = useAuction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createAuctionSchema),
    defaultValues: {
      title: '',
      category: 'Điện tử',
      startingPrice: 1000000,
      minStep: 50000,
      buyItNowPrice: '',
      durationHours: '24',
      requiresDeposit: false,
      condition: 'Mới 99% - Fullbox chính hãng, nguyên tem bảo hành.',
      image: ''
    }
  });

  if (!modals.isCreateOpen) return null;

  const onSubmit = (data) => {
    const newProduct = {
      id: Date.now(),
      title: data.title,
      category: data.category,
      startingPrice: Number(data.startingPrice),
      currentPrice: Number(data.startingPrice),
      minStep: Number(data.minStep),
      buyItNowPrice: data.buyItNowPrice ? Number(data.buyItNowPrice) : null,
      requiresDeposit: Boolean(data.requiresDeposit),
      condition: data.condition,
      image: data.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
      endTime: new Date(Date.now() + Number(data.durationHours) * 3600 * 1000).toISOString()
    };
    addProduct(newProduct);
    reset();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #3F3F46',
    backgroundColor: '#09090B',
    color: '#FAFAFA',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#A1A1AA',
    textTransform: 'uppercase',
    marginBottom: '6px'
  };

  const errorStyle = { color: '#EF4444', fontSize: '11px', marginTop: '4px' };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#18181B', borderRadius: '16px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #3F3F46', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' }}>
        <div style={{ backgroundColor: '#09090B', color: '#EF4444', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27272A' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>Tạo Phiên Đấu Giá Mới</h2>
          <button onClick={closeCreateModal} style={{ background: 'none', border: 'none', color: '#A1A1AA', fontSize: '24px', cursor: 'pointer', fontWeight: '700' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', color: '#FAFAFA' }}>
          <div>
            <label style={labelStyle}>Tên sản phẩm</label>
            <input {...register('title')} placeholder="VD: Đồng hồ Rolex Submariner 2023" style={inputStyle} />
            {errors.title && <div style={errorStyle}>{errors.title.message}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Danh mục</label>
              <select {...register('category')} style={inputStyle}>
                <option value="Điện tử">Điện tử</option>
                <option value="Đồng hồ">Đồng hồ</option>
                <option value="Đồ cổ / Nghệ thuật">Đồ cổ / Nghệ thuật</option>
                <option value="Xe cộ">Xe cộ</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Thời gian đấu giá</label>
              <select {...register('durationHours')} style={inputStyle}>
                <option value="0.05">3 Phút (Test nhanh)</option>
                <option value="1">1 Giờ</option>
                <option value="12">12 Giờ</option>
                <option value="24">24 Giờ (1 ngày)</option>
                <option value="72">72 Giờ (3 ngày)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Giá khởi điểm (đ)</label>
              <input type="number" {...register('startingPrice')} style={inputStyle} />
              {errors.startingPrice && <div style={errorStyle}>{errors.startingPrice.message}</div>}
            </div>
            <div>
              <label style={labelStyle}>Bước giá tối thiểu (đ)</label>
              <input type="number" {...register('minStep')} style={inputStyle} />
              {errors.minStep && <div style={errorStyle}>{errors.minStep.message}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center' }}>
            <div>
              <label style={labelStyle}>Giá Mua Ngay (Tùy chọn)</label>
              <input type="number" {...register('buyItNowPrice')} placeholder="Bỏ trống nếu không có" style={inputStyle} />
              {errors.buyItNowPrice && <div style={errorStyle}>{errors.buyItNowPrice.message}</div>}
            </div>
            <div style={{ paddingTop: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#EF4444', fontWeight: '600' }}>
                <input type="checkbox" {...register('requiresDeposit')} />
                🔒 Yêu cầu đặt cọc 10%
              </label>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Tình trạng sản phẩm</label>
            <input {...register('condition')} style={inputStyle} />
            {errors.condition && <div style={errorStyle}>{errors.condition.message}</div>}
          </div>

          <div>
            <label style={labelStyle}>URL Hình ảnh</label>
            <input type="url" {...register('image')} placeholder="https://..." style={inputStyle} />
            {errors.image && <div style={errorStyle}>{errors.image.message}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #27272A' }}>
            <button
              type="button"
              onClick={closeCreateModal}
              style={{ padding: '10px 16px', border: '1px solid #3F3F46', background: 'transparent', color: '#A1A1AA', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{ padding: '10px 20px', background: '#EF4444', color: '#09090B', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)' }}
            >
              Tạo Phiên Đấu Giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}