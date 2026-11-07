import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products?limit=12')
      if (!response.ok) {
        return rejectWithValue(`Products could not be loaded (${response.status}).`)
      }

      const products = await response.json()
      if (!Array.isArray(products)) {
        return rejectWithValue('The product service returned an unexpected response.')
      }

      return products.map((product) => ({
        ...product,
        category: product.category
          ?.split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      }))
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Products could not be loaded.',
      )
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })
  },
})

export default productsSlice.reducer
