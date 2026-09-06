import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  theme: 'light' | 'dark';
  blockedUsers: Record<number, true>;
}

const initialState: AppState = {
  theme: 'light',
  blockedUsers: {},
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    blockUser: (state, action: PayloadAction<number>) => {
      state.blockedUsers[action.payload] = true;
    },
    unblockUser: (state, action: PayloadAction<number>) => {
      delete state.blockedUsers[action.payload];
    },
  },
});

export const appSliceActions = appSlice.actions;

export const appReducer = appSlice.reducer;
