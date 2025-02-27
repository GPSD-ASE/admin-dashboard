import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './features/user/userSlice'
import { mapInteractionSlice } from './features/map_interaction/mapInteractionSlice';


export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
      mapInteraction: mapInteractionSlice.reducer
    },
  })
}

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
