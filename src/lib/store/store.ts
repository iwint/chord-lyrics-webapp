import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { songsApi } from './api/songsApi';
import { authApi } from './api/authApi';
import { pinsApi } from './api/pinsApi';
import { aiChatApi } from './api/aiChatApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [songsApi.reducerPath]: songsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [pinsApi.reducerPath]: pinsApi.reducer,
    [aiChatApi.reducerPath]: aiChatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      songsApi.middleware,
      authApi.middleware,
      pinsApi.middleware,
      aiChatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
