import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { auctionApi } from '../services/auctionApi';

const AuctionContext = createContext(null);

const initialState = {
  user: null,
  products: INITIAL_PRODUCTS,
  watchlist: [],
  depositedIds: [],
  depositedAmounts: {},
  refundedIds: [],
  activeBids: {},
  notifications: [],
  isSandboxEnabled: true,
  modals: {
    isLoginOpen: false,
    isCreateOpen: false,
    paymentItem: null
  }
};

function parseEndTimeMs(endTime) {
  if (!endTime) return NaN;
  if (typeof endTime === 'number') {
    return endTime > 1e11 ? endTime : Date.now() + endTime * 1000;
  }
  return new Date(endTime).getTime();
}

function auctionReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: {
          ...action.payload,
          walletBalance: 0
        },
        modals: { ...state.modals, isLoginOpen: false }
      };

    case 'TOGGLE_SANDBOX':
      return { ...state, isSandboxEnabled: !state.isSandboxEnabled };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        watchlist: [],
        depositedIds: [],
        depositedAmounts: {},
        refundedIds: [],
        activeBids: {}
      };

    case 'SET_LOGIN_MODAL':
      return { ...state, modals: { ...state.modals, isLoginOpen: action.payload } };

    case 'SET_CREATE_MODAL':
      return { ...state, modals: { ...state.modals, isCreateOpen: action.payload } };

    case 'SET_PAYMENT_MODAL':
      return { ...state, modals: { ...state.modals, paymentItem: action.payload } };

    case 'TOGGLE_WATCHLIST': {
      const productId = action.payload;
      const exists = state.watchlist.includes(productId);
      return {
        ...state,
        watchlist: exists
          ? state.watchlist.filter((id) => id !== productId)
          : [...state.watchlist, productId]
      };
    }

    case 'PLACE_BID': {
      const { productId, amount, isProxy = false, maxProxy = null } = action.payload;
      const prodKey = String(productId);
      const bidderName = isProxy
        ? `${state.user.name} (Tự động 🤖)`
        : state.user.name;

      return {
        ...state,
        activeBids: {
          ...state.activeBids,
          [prodKey]: { amount, isProxy, maxProxy }
        },
        products: state.products.map((p) =>
          String(p.id) === prodKey
            ? {
                ...p,
                currentPrice: amount,
                bidHistory: [
                  {
                    bidder: bidderName,
                    amount,
                    time: isProxy ? 'Vừa xong (Proxy)' : 'Vừa xong'
                  },
                  ...(p.bidHistory || [])
                ]
              }
            : p
        )
      };
    }

    case 'AUTO_PROXY_COUNTER_BID': {
      const { productId, autoBidAmount, maxProxy } = action.payload;
      const prodKey = String(productId);
      if (!state.user) return state;

      return {
        ...state,
        activeBids: {
          ...state.activeBids,
          [prodKey]: { amount: autoBidAmount, isProxy: true, maxProxy }
        },
        products: state.products.map((p) =>
          String(p.id) === prodKey
            ? {
                ...p,
                currentPrice: autoBidAmount,
                bidHistory: [
                  {
                    bidder: `${state.user.name} (Tự động 🤖)`,
                    amount: autoBidAmount,
                    time: 'Vừa xong (Proxy tự động)'
                  },
                  ...(p.bidHistory || [])
                ]
              }
            : p
        )
      };
    }

    case 'BUY_IT_NOW': {
      const { item } = action.payload;
      const buyPrice = item.buyItNowPrice;
      const prodKey = String(item.id);
      return {
        ...state,
        activeBids: {
          ...state.activeBids,
          [prodKey]: { amount: buyPrice, isProxy: false }
        },
        products: state.products.map((p) =>
          String(p.id) === prodKey
            ? {
                ...p,
                currentPrice: buyPrice,
                endTime: new Date().toISOString(),
                bidHistory: [
                  {
                    bidder: `${state.user.name} (Mua ngay ⚡)`,
                    amount: buyPrice,
                    time: 'Vừa xong'
                  },
                  ...(p.bidHistory || [])
                ]
              }
            : p
        ),
        modals: {
          ...state.modals,
          paymentItem: { ...item, currentPrice: buyPrice, paymentType: 'escrow' }
        }
      };
    }

    case 'COMPLETE_PAYMENT': {
      const { item, paymentType, amount } = action.payload;
      const prodKey = String(item.id);
      if (paymentType === 'deposit') {
        const depositValue = Number(amount) || Math.round((item.startingPrice || item.currentPrice) * 0.1);
        const alreadyDeposited = state.depositedIds.some((id) => String(id) === prodKey);
        return {
          ...state,
          depositedIds: alreadyDeposited ? state.depositedIds : [...state.depositedIds, item.id],
          depositedAmounts: {
            ...state.depositedAmounts,
            [prodKey]: depositValue
          },
          user: state.user
            ? { ...state.user, walletBalance: Math.max(0, (state.user.walletBalance || 0) - depositValue) }
            : null
        };
      }
      return {
        ...state,
        products: state.products.map((p) =>
          String(p.id) === prodKey ? { ...p, escrowStatus: 'Đang giữ tiền trung gian' } : p
        )
      };
    }

    case 'REFUND_DEPOSIT': {
      const { productId, refundAmount } = action.payload;
      const prodKey = String(productId);
      if (state.refundedIds.some((id) => String(id) === prodKey)) return state;

      return {
        ...state,
        refundedIds: [...state.refundedIds, prodKey],
        depositedIds: state.depositedIds.filter((id) => String(id) !== prodKey),
        user: state.user
          ? {
              ...state.user,
              walletBalance: (state.user.walletBalance || 0) + Number(refundAmount)
            }
          : null
      };
    }

    case 'UPDATE_ESCROW_STATUS': {
      const { productId, status, extra } = action.payload;
      return {
        ...state,
        products: state.products.map((p) =>
          String(p.id) === String(productId) ? { ...p, escrowStatus: status, ...extra } : p
        )
      };
    }

    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products],
        modals: { ...state.modals, isCreateOpen: false }
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case 'UPDATE_USER':
      return { ...state, user: action.payload };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload)
      };

    default:
      return state;
  }
}

export function AuctionProvider({ children }) {
  const [state, dispatch] = useReducer(auctionReducer, initialState);

  useEffect(() => {
    let isMounted = true;
    auctionApi.getProducts().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        dispatch({ type: 'SET_PRODUCTS', payload: data });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const pushNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 5000);
  }, []);

  // Tự động kiểm tra mỗi giây: hoàn cọc 100% về ví nếu phiên kết thúc mà user KHÔNG thắng
  useEffect(() => {
    if (!state.user || state.depositedIds.length === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();

      state.depositedIds.forEach((prodId) => {
        const prodKey = String(prodId);
        if (state.refundedIds.some((id) => String(id) === prodKey)) return;

        const product = state.products.find((p) => String(p.id) === prodKey);
        if (!product) return;

        const endTimeMs = parseEndTimeMs(product.endTime);
        if (!Number.isNaN(endTimeMs) && now >= endTimeMs) {
          const highestBid = product.bidHistory?.[0];
          const cleanWinner = highestBid?.bidder
            ? highestBid.bidder.replace(' (Tự động 🤖)', '').replace(' (Mua ngay ⚡)', '').trim()
            : '';

          const isUserWinner = Boolean(cleanWinner && cleanWinner === state.user.name.trim());

          if (!isUserWinner) {
            const refundAmount =
              state.depositedAmounts[prodKey] ||
              Math.round((product.startingPrice || product.currentPrice) * 0.1);

            dispatch({
              type: 'REFUND_DEPOSIT',
              payload: { productId: prodKey, refundAmount }
            });

            pushNotification(
              `💸 Hoàn trả 100% tiền cọc (+${refundAmount.toLocaleString()}đ) về ví từ phiên "${product.title}"!`,
              'success'
            );
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.user, state.products, state.depositedIds, state.depositedAmounts, state.refundedIds, pushNotification]);

  const loginSuccess = (userData) => {
    const initializedUser = {
      ...userData,
      walletBalance: 0
    };
    dispatch({ type: 'LOGIN_SUCCESS', payload: initializedUser });
    pushNotification(
      `👋 Chào mừng ${initializedUser.name}! Trạng thái KYC: ${initializedUser.isKycVerified ? 'Đã xác thực' : 'Chưa xác thực'}`
    );
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    pushNotification('Đã đăng xuất khỏi hệ thống.');
  };

  const toggleWatchlist = (item) => {
    if (!state.user) {
      dispatch({ type: 'SET_LOGIN_MODAL', payload: true });
      return;
    }
    const isWatched = state.watchlist.includes(item.id);
    dispatch({ type: 'TOGGLE_WATCHLIST', payload: item.id });
    pushNotification(
      isWatched ? `Đã bỏ theo dõi "${item.title}"` : `❤️ Đã thêm "${item.title}" vào Watchlist`
    );
  };

  const placeBid = async (item, amount, isProxy = false, maxProxy = null) => {
    if (!state.user) {
      dispatch({ type: 'SET_LOGIN_MODAL', payload: true });
      return false;
    }

    const needsDeposit =
      item.requiresDeposit && !state.depositedIds.some((id) => String(id) === String(item.id));
    if (needsDeposit) {
      pushNotification(`🔒 Tài sản giá trị cao yêu cầu đặt cọc 10% trước khi trả giá!`, 'warning');
      dispatch({ type: 'SET_PAYMENT_MODAL', payload: { ...item, paymentType: 'deposit' } });
      return false;
    }

    dispatch({
      type: 'PLACE_BID',
      payload: { productId: item.id, amount, isProxy, maxProxy }
    });

    await auctionApi.updateProduct(item.id, { currentPrice: amount });

    if (isProxy) {
      pushNotification(
        `🤖 Đã bật Proxy Bid cho "${item.title}" (Mức trần: ${maxProxy.toLocaleString()}đ). Giá hiện tại: ${amount.toLocaleString()}đ`,
        'success'
      );
    } else {
      pushNotification(
        `💰 Bạn đã đặt giá ${amount.toLocaleString()}đ cho "${item.title}". Hệ thống sẽ báo ngay nếu có người vượt giá!`,
        'success'
      );
    }
    return true;
  };

  const buyItNow = async (item) => {
    if (!state.user) {
      dispatch({ type: 'SET_LOGIN_MODAL', payload: true });
      return;
    }
    const needsDeposit =
      item.requiresDeposit && !state.depositedIds.some((id) => String(id) === String(item.id));
    if (needsDeposit) {
      pushNotification(`🔒 Vui lòng nạp cọc 10% trước khi Mua Ngay tài sản này!`, 'warning');
      dispatch({ type: 'SET_PAYMENT_MODAL', payload: { ...item, paymentType: 'deposit' } });
      return;
    }

    dispatch({ type: 'BUY_IT_NOW', payload: { item } });
    await auctionApi.updateProduct(item.id, { currentPrice: item.buyItNowPrice });
    pushNotification(
      `⚡ Chúc mừng! Bạn đã chốt Mua Ngay "${item.title}" với giá ${item.buyItNowPrice.toLocaleString()}đ.`,
      'success'
    );
  };

  const completePayment = (item, paymentType, amount) => {
    dispatch({ type: 'COMPLETE_PAYMENT', payload: { item, paymentType, amount } });
    if (paymentType === 'deposit') {
      pushNotification(
        `✅ Đã đặt cọc ${Number(amount).toLocaleString()}đ cho "${item.title}". Bạn đã có thể trả giá!`,
        'success'
      );
    } else {
      pushNotification(
        `🛡️ Hệ thống Escrow đã nhận ${Number(amount).toLocaleString()}đ. Chờ người bán giao hàng.`,
        'success'
      );
    }
  };

  const confirmDelivery = (productId, ratingText) => {
    dispatch({
      type: 'UPDATE_ESCROW_STATUS',
      payload: {
        productId,
        status: 'Đã giải ngân & Hoàn tất',
        extra: { buyerReview: ratingText }
      }
    });
    pushNotification(`⭐ Cảm ơn đánh giá của bạn! Tiền đã được giải ngân cho người bán.`, 'success');
  };

  const fileDispute = (productId, reason) => {
    dispatch({
      type: 'UPDATE_ESCROW_STATUS',
      payload: {
        productId,
        status: '⚖️ Đang tranh chấp (Trọng tài xử lý)',
        extra: { disputeReason: reason }
      }
    });
    pushNotification(
      `⚖️ Đã tiếp nhận khiếu nại! Khoản tiền Escrow tiếp tục bị đóng băng để trọng tài xác minh.`,
      'warning'
    );
  };

  const addProduct = async (newProd) => {
    const productWithSeller = {
      ...newProd,
      sellerId: state.user?.id,
      seller: {
        name: state.user?.name || 'Người bán mới',
        rating: 5.0,
        totalSales: 1
      },
      bidHistory: []
    };
    const saved = await auctionApi.createProduct(productWithSeller);
    dispatch({ type: 'ADD_PRODUCT', payload: saved });
    pushNotification(`🎉 Đã đăng phiên đấu giá mới: "${saved.title}"`, 'success');
  };

  const topUpWallet = (amount) => {
    if (!state.user || amount <= 0) return;
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        ...state.user,
        walletBalance: (state.user.walletBalance || 0) + Number(amount)
      }
    });
    pushNotification(`💰 Đã nạp thành công +${Number(amount).toLocaleString()}đ vào Ví Đặt Cọc!`, 'success');
  };

  const sandboxTopUpWallet = () => {
    if (!state.user) {
      dispatch({ type: 'SET_LOGIN_MODAL', payload: true });
      return;
    }
    dispatch({
      type: 'UPDATE_USER',
      payload: { ...state.user, walletBalance: (state.user.walletBalance || 0) + 500000000, isKycVerified: true }
    });
    pushNotification('🧪 [Sandbox] Đã nạp +500.000.000đ vào Ví & bật KYC thành công!', 'info');
  };

  const sandboxSimulateBotBid = (productId) => {
    const prodKey = String(productId);
    const target = state.products.find((p) => String(p.id) === prodKey);
    if (!target) return;

    const botNames = ['Đại Gia Quận 1 (Bot)', 'Sưu Tầm Cổ Vật (Bot)', 'Shark Hưng (Bot)'];
    const randomBot = botNames[Math.floor(Math.random() * botNames.length)];
    const step = target.minStep || 50000;
    const botBidPrice = target.currentPrice + step;

    const updatedProducts = state.products.map((p) =>
      String(p.id) === prodKey
        ? {
            ...p,
            currentPrice: botBidPrice,
            bidHistory: [
              { bidder: randomBot, amount: botBidPrice, time: 'Vừa xong (Sandbox)' },
              ...(p.bidHistory || [])
            ]
          }
        : p
    );

    dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
    pushNotification(
      `🤖 [Sandbox] ${randomBot} vừa trả ${botBidPrice.toLocaleString()}đ cho "${target.title}"!`,
      'warning'
    );

    const userProxy = state.activeBids[prodKey];
    if (state.user && userProxy?.isProxy && Number(userProxy.maxProxy) > botBidPrice) {
      const nextAutoBid = Math.min(Number(userProxy.maxProxy), botBidPrice + step);
      setTimeout(() => {
        dispatch({
          type: 'AUTO_PROXY_COUNTER_BID',
          payload: {
            productId: prodKey,
            autoBidAmount: nextAutoBid,
            maxProxy: Number(userProxy.maxProxy)
          }
        });
        pushNotification(
          `⚡ [Proxy Bid] Hệ thống tự động nâng giá lên ${nextAutoBid.toLocaleString()}đ (Trần: ${Number(userProxy.maxProxy).toLocaleString()}đ) để giữ vị trí dẫn đầu cho bạn!`,
          'success'
        );
      }, 650);
    } else if (state.user && userProxy?.isProxy && Number(userProxy.maxProxy) <= botBidPrice) {
      pushNotification(
        `⚠️ Đối thủ đã vượt qua mức giá trần Proxy (${Number(userProxy.maxProxy).toLocaleString()}đ) của bạn!`,
        'warning'
      );
    }
  };

  const sandboxFastForwardEnd = (productId) => {
    const target = state.products.find((p) => String(p.id) === String(productId));
    if (!target) return;

    const fiveSecondsLater = new Date(Date.now() + 5000).toISOString();
    const updatedProducts = state.products.map((p) =>
      String(p.id) === String(target.id) ? { ...p, endTime: fiveSecondsLater } : p
    );

    dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
    pushNotification(`⏩ [Sandbox] Đã tua nhanh "${target.title}" về còn 5 giây cuối!`, 'info');
  };

  const value = {
    ...state,
    pushNotification,
    loginSuccess,
    logout,
    toggleWatchlist,
    placeBid,
    buyItNow,
    completePayment,
    confirmDelivery,
    fileDispute,
    addProduct,
    topUpWallet,
    toggleSandbox: () => dispatch({ type: 'TOGGLE_SANDBOX' }),
    sandboxTopUpWallet,
    sandboxSimulateBotBid,
    sandboxFastForwardEnd,
    openLoginModal: () => dispatch({ type: 'SET_LOGIN_MODAL', payload: true }),
    closeLoginModal: () => dispatch({ type: 'SET_LOGIN_MODAL', payload: false }),
    openCreateModal: () => dispatch({ type: 'SET_CREATE_MODAL', payload: true }),
    closeCreateModal: () => dispatch({ type: 'SET_CREATE_MODAL', payload: false }),
    openPaymentModal: (itemWithType) => dispatch({ type: 'SET_PAYMENT_MODAL', payload: itemWithType }),
    closePaymentModal: () => dispatch({ type: 'SET_PAYMENT_MODAL', payload: null })
  };

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

export function useAuction() {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction phải được dùng bên trong AuctionProvider');
  }
  return context;
}