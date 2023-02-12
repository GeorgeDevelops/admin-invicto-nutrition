import { createSlice } from '@reduxjs/toolkit';

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    value: []
  },

  reducers: {
    getProducts: function (state, actions) {
      state.value = actions.payload;
    }
  },
});

export const { getProducts } = productsSlice.actions;
export default productsSlice.reducer;
