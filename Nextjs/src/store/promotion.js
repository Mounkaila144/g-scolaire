import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPromotion: null
};

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    selectPromotion: (state, action) => {
      state.selectedPromotion = action.payload;
    }
  }
});

export const { selectPromotion } = promotionSlice.actions;

export default promotionSlice.reducer;
