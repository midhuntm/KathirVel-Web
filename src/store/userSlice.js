import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: (() => {
    try {
      const stored = localStorage.getItem('vetrivel_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('vetrivel_token') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) localStorage.setItem('vetrivel_token', action.payload.token);
      localStorage.setItem('vetrivel_user', JSON.stringify(action.payload.user));
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('vetrivel_user');
      localStorage.removeItem('vetrivel_token');
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
