import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('token');
    const isAdmin = Cookies.get('isAdmin') === 'true';
    return {
      user: null,
      token: token || null,
      isAuthenticated: !!token,
      isAdmin,
    };
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isAdmin = user.role === 'ADMIN';
      
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('userId', user.user_id, { expires: 7 });
      Cookies.set('isAdmin', state.isAdmin ? 'true' : 'false', { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      
      Cookies.remove('token');
      Cookies.remove('userId');
      Cookies.remove('isAdmin');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
