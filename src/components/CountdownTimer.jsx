import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, onExpire }) {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - Date.now();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Cập nhật ngay lập tức khi targetDate thay đổi (từ Sandbox)
    const initial = calculateTimeLeft();
    setTimeLeft(initial);
    if (initial.isExpired) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      const next = calculateTimeLeft();
      setTimeLeft(next);
      if (next.isExpired) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  const pad = (n) => String(n).padStart(2, '0');

  if (timeLeft.isExpired) {
    return (
      <span style={{ color: '#FB7185', fontWeight: '800', fontSize: '12px' }}>
        ĐÃ KẾT THÚC
      </span>
    );
  }

  return (
    <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '13px', color: '#FB7185' }}>
      ⏳ {pad(timeLeft.hours)} : {pad(timeLeft.minutes)} : {pad(timeLeft.seconds)}
    </span>
  );
}