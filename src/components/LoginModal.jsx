import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuction } from '../context/AuctionContext';

const loginSchema = yup.object({
  email: yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng'),
  password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu tối thiểu 6 ký tự')
});

const registerSchema = yup.object({
  name: yup.string().required('Vui lòng nhập họ và tên theo CCCD').min(3, 'Họ tên quá ngắn'),
  email: yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng'),
  password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^0\d{9}$/, 'Số điện thoại phải gồm 10 chữ số bắt đầu bằng 0'),
  cccd: yup
    .string()
    .required('Vui lòng nhập số CCCD')
    .matches(/^\d{12}$/, 'Số CCCD phải gồm đúng 12 chữ số'),
  cardNumber: yup
    .string()
    .required('Vui lòng nhập số thẻ bảo đảm')
    .matches(/^\d{16}$/, 'Số thẻ thanh toán phải gồm 16 chữ số')
});

export default function LoginModal() {
  const { modals, closeLoginModal, loginSuccess } = useAuction();
  const [isRegister, setIsRegister] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(isRegister ? registerSchema : loginSchema),
    mode: 'onTouched'
  });

  if (!modals.isLoginOpen) return null;

  const handleToggleMode = () => {
    setIsRegister((prev) => !prev);
    reset();
  };

  const onSubmit = (data) => {
    loginSuccess({
      id: Date.now(),
      name: data.name || data.email.split('@')[0],
      email: data.email,
      phone: data.phone || '0901234567',
      cccd: data.cccd || '001200001234',
      isKycVerified: true,
      walletBalance: 50000000 // Tặng sẵn 50tr trong ví đặt cọc để trải nghiệm
    });
    reset();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #3F3F46',
    backgroundColor: '#09090B',
    color: '#FAFAFA',
    fontSize: '14px',
    outline: 'none',
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

  const errorStyle = {
    color: '#EF4444',
    fontSize: '11px',
    marginTop: '4px'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#18181B', borderRadius: '16px', maxWidth: '420px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #3F3F46', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' }}>
        <div style={{ backgroundColor: '#09090B', padding: '24px', textAlign: 'center', borderBottom: '1px solid #27272A', position: 'relative' }}>
          <button onClick={closeLoginModal} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#A1A1AA', fontSize: '24px', cursor: 'pointer' }}>&times;</button>

          <div style={{ width: '50px', height: '50px', backgroundColor: '#EF4444', color: '#FFFFFF', fontWeight: '900', fontSize: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' }}>
            NQH
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: '#EF4444' }}>
            {isRegister ? 'ĐĂNG KÝ & XÁC THỰC KYC' : 'ĐĂNG NHẬP NQH'}
          </h2>
          <p style={{ fontSize: '12px', color: '#A1A1AA', margin: 0 }}>
            {isRegister ? 'Xác minh danh tính để chống phá giá ảo & tham gia đấu giá' : 'Đăng nhập để đặt giá và đăng bán sản phẩm'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', color: '#FAFAFA' }}>
          {isRegister && (
            <div>
              <label style={labelStyle}>Họ và tên (Theo CCCD)</label>
              <input {...register('name')} placeholder="Nguyễn Văn A" style={inputStyle} />
              {errors.name && <div style={errorStyle}>{errors.name.message}</div>}
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input {...register('email')} placeholder="example@gmail.com" style={inputStyle} />
            {errors.email && <div style={errorStyle}>{errors.email.message}</div>}
          </div>

          <div>
            <label style={labelStyle}>Mật khẩu</label>
            <input type="password" {...register('password')} placeholder="••••••••" style={inputStyle} />
            {errors.password && <div style={errorStyle}>{errors.password.message}</div>}
          </div>

          {isRegister && (
            <div style={{ borderTop: '1px solid #27272A', paddingTop: '14px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444', letterSpacing: '0.5px' }}>
                🛡️ THÔNG TIN XÁC MINH DANH TÍNH (KYC)
              </div>

              <div>
                <label style={labelStyle}>Số điện thoại chính chủ</label>
                <input {...register('phone')} placeholder="0901234567" style={inputStyle} />
                {errors.phone && <div style={errorStyle}>{errors.phone.message}</div>}
              </div>

              <div>
                <label style={labelStyle}>Số CCCD (12 chữ số)</label>
                <input {...register('cccd')} placeholder="001200001234" style={inputStyle} />
                {errors.cccd && <div style={errorStyle}>{errors.cccd.message}</div>}
              </div>

              <div>
                <label style={labelStyle}>Thẻ thanh toán bảo đảm (16 số)</label>
                <input {...register('cardNumber')} placeholder="4111222233334444" style={inputStyle} />
                {errors.cardNumber && <div style={errorStyle}>{errors.cardNumber.message}</div>}
              </div>
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#EF4444', color: '#FFFFFF', fontWeight: '800', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', marginTop: '8px', boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)' }}
          >
            {isRegister ? 'Hoàn Tất Đăng Ký & KYC' : 'Đăng Nhập'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <button
              type="button"
              onClick={handleToggleMode}
              style={{ background: 'none', border: 'none', color: '#A1A1AA', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký & Xác thực KYC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}