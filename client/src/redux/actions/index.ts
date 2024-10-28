import { getCurrentAPI } from "@/api/user";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getCurrentThunk = createAsyncThunk(
  "user/current",
  async () => {
    const response: any = await getCurrentAPI();
    if (response.data.success) {
    const user = JSON.parse(response.data.user);
    return user;
    }
    return null;
  }
);
