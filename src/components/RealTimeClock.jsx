import React, { useState, useEffect } from 'react';

export default function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('vi-VN', options);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#09090B', padding: '6px 14px', borderRadius: '8px', border: '1px solid #27272A', color: '#FAFAFA', fontSize: '13px', fontFamily: 'monospace' }}>
      <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981', display: 'inline-block' }}></span>
      <span style={{ color: '#A1A1AA', textTransform: 'capitalize' }}>
        {formatDate(time)}
      </span>
      <span style={{ color: '#3F3F46' }}>|</span>
      <strong style={{ color: '#EF4444', fontSize: '14px', letterSpacing: '1px' }}>
        {time.toLocaleTimeString('vi-VN')}
      </strong>
    </div>
  );
}