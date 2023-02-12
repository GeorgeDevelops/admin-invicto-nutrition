import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: {}
  },

  reducers: {
    setAdmin: function (state, actions) {
      state.value = actions.payload;
    }
  },
});

export const { setAdmin } = userSlice.actions;
export default userSlice.reducer;
