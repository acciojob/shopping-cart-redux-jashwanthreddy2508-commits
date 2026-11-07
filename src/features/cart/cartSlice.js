import { createSlice } from '@reduxjs/toolkit'

const coupons = {
  SAVE10: { type: 'percent', value: 10 },
  WELCOME10: { type: 'percent', value: 10 },
  DISCOUNT10: { type: 'percent', value: 10 },
  SAVE15: { type: 'percent', value: 15 },
  WELCOME15: { type: 'percent', value: 15 },
  FLAT50: { type: 'fixed', value: 50 },
}

const initialState = {
  items: [],
  wishlist: [],
  appliedCoupon: null,
  couponMessage: '',
  couponStatus: 'idle',
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((product) => product.id === action.payload)
      if (item) item.quantity += 1
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((product) => product.id === action.payload)
      if (!item) return
      if (item.quantity <= 1) {
        state.items = state.items.filter((product) => product.id !== action.payload)
      } else {
        item.quantity -= 1
      }
    },
    toggleWishlist: (state, action) => {
      const product = action.payload
      const existingIndex = state.wishlist.findIndex((item) => item.id === product.id)
      if (existingIndex >= 0) {
        state.wishlist.splice(existingIndex, 1)
      } else {
        state.wishlist.push(product)
      }
    },
    applyCoupon: (state, action) => {
      const code = action.payload.trim().toUpperCase()
      const discount = coupons[code]
      if (!discount) {
        state.couponStatus = 'error'
        state.couponMessage = 'That code did not work. Try SAVE10 or FLAT50.'
        return
      }
      state.appliedCoupon = { code, ...discount }
      state.couponStatus = 'success'
      state.couponMessage = `${code} applied successfully.`
    },
    clearCoupon: (state) => {
      state.appliedCoupon = null
      state.couponStatus = 'idle'
      state.couponMessage = ''
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  toggleWishlist,
  applyCoupon,
  clearCoupon,
} = cartSlice.actions

export default cartSlice.reducer
