import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './features/user/userSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        user: userSlice.reducer,
    }
  })
}

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;