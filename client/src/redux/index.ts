import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/user.slice'
import appSlice from './slices/app.slice'



export const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch