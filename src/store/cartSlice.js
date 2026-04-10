import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: (() => {
    try {
      const stored = localStorage.getItem('vetrivel_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      localStorage.setItem('vetrivel_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('vetrivel_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem('vetrivel_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('vetrivel_cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
