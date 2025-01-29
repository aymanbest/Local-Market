import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [
      {
        id: 1,
        name: "Organic Mountain Coffee",
        price: 5.00,
        image: "https://placehold.co/600x400",
        quantity: 1
      },
      {
        id: 2,
        name: "Wild Forest Honey",
        price: 11.00,
        image: "https://placehold.co/600x400",
        quantity: 1
      },
      {
        id: 3,
        name: "Local Farm Fresh Eggs",
        price: 5.00,
        image: "https://placehold.co/600x400",
        quantity: 1
      }
    ]
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

