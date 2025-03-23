/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/users/login`;
export const REGISTER_URL = `${API_URL}/users/signup`;
export const FORGOT_PASSWORD_URL = `${API_URL}/users/forget-password`;
export const RESET_PASSWORD_URL = `${API_URL}/users/reset-password`;
export const GET_USER_URL = `${API_URL}/users/user`;

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  changePassword: (
    email: string,
    password: string,
    otp: string,
    password_confirmation: string
  ) => Promise<void>;
  getUser: () => Promise<AxiosResponse<any>>;
  logout: () => void;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(undefined);

  const verify = async () => {
    if (auth) {
      try {
        const { data: user } = await getUser();
        setCurrentUser(user);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(LOGIN_URL, {
        email,
        password
      });
      saveAuth(data.data.tokens);
      setCurrentUser(data.data.user);
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const register = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => {
    try {
      const { data: auth } = await axios.post(REGISTER_URL, {
        first_name,
        last_name,
        email,
        password
      });
      console.log('auth', auth);
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    await axios.post(FORGOT_PASSWORD_URL, {
      email
    });
  };

  const changePassword = async (
    email: string,
    otp: String,
    password: string,
    password_confirmation: string
  ) => {
    await axios.post(RESET_PASSWORD_URL, {
      email,
      otp,
      password,
      password_confirmation
    });
    console.log(email, password, otp);
  };

  const getUser = async () => {
    console.log('auth', auth);
    return await axios.get<UserModel>(GET_USER_URL, {
      headers: {
        Authorization: `Bearer ${auth?.access_token}`
      }
    });
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        logout,
        verify
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
