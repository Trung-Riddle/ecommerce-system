import { createSlice, current } from "@reduxjs/toolkit";
import { getCurrentThunk } from "../actions";

interface userState {
  current: any;
  isLoading: boolean;
  message?: string | null;
}
const initialState: userState = {
  current: null,
  isLoading: false,
  message: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    auth: (state, action) => {
      state.current = action.payload;
    },
    logout: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentThunk.fulfilled, (state, action) => {
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(getCurrentThunk.rejected, (state) => {
        state.current = null;
        state.isLoading = false;
      });
  },
});
export const { logout, auth } = userSlice.actions;
export default userSlice.reducer;
