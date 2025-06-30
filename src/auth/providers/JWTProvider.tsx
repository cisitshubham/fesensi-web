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
import { MasterDropdownProvider } from '@/pages/global-components/master-dropdown-context';
import { RoleProvider } from '@/pages/global-components/role-context';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/users/login`;
export const REGISTER_URL = `${API_URL}/users/signup`;
export const FORGOT_PASSWORD_URL = `${API_URL}/users/forget-password`;
export const RESET_PASSWORD_URL = `${API_URL}/users/reset-password`;
export const GET_USER_URL = `${API_URL}/users/me`;
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

  const login = async (email: string, password: string) =>
    await axios.post(LOGIN_URL, {
      email,
      password
    })
      .then(async ({ data }) => {
        try {
          localStorage.setItem('response', JSON.stringify(data));
          
          // Check if we have the required data structure
          if (!data?.data?.tokens?.access_token) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response format from server');
          }

          // Store token and auth data
          localStorage.setItem('token', data.data.tokens.access_token);
          saveAuth(data.data.tokens);
          
          // Store user data
          if (data.data.user) {
            setCurrentUser(data.data.user);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            localStorage.setItem('role', JSON.stringify(data.data.user.role));
            
            // Handle role selection
            const userRoles = data.data.user.role;
            let selectedRole = '';

            // Check for ADMIN role first
            if (userRoles.some((role: { role_name: string }) => role.role_name === 'ADMIN')) {
              selectedRole = 'ADMIN';
            }
            // Then check for AGENT role
            else if (userRoles.some((role: { role_name: string }) => role.role_name === 'AGENT')) {
              selectedRole = 'AGENT';
            }
            // Finally, check for USER role
            else if (userRoles.some((role: { role_name: string }) => role.role_name === 'CUSTOMER')) {
              selectedRole = 'CUSTOMER';
            }

            // Set the selected role in localStorage
            if (selectedRole) {
              localStorage.setItem('selectedRole', JSON.stringify(selectedRole));
            }
          }

          // Verify auth state before redirecting
          await verify();
          
          // Redirect to home
          window.location.href = '/';
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      })
      .catch((error) => {
        console.error('Login request failed:', error);
        const errorResponse = error.response?.data || { message: 'An error occurred during login' };
        localStorage.setItem('response', JSON.stringify(errorResponse));
        saveAuth(undefined);
        throw new Error(errorResponse.message || 'Login failed');
      });

  const register = async (
    first_name: string,
    email: string,
    password: string
  ) => {
    try {
      const { data } = await axios.post(REGISTER_URL, {
        first_name,
        email,
        password,
      });
      localStorage.setItem('response', JSON.stringify(data));
      return data;
    } catch (error: any) {
      console.error('Register request failed:', error);
      const errorResponse = error.response?.data || { message: 'An error occurred during registration' };
      localStorage.setItem('response', JSON.stringify(errorResponse));
      throw new Error(errorResponse.message || 'Registration failed');
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
  };

  const getUser = async () => {
    return await axios.get<UserModel>(GET_USER_URL, {
      headers: {
        Authorization: ` ${auth?.access_token}`
      }
    });
  };

  // Clear all local storage items on logout
  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
    localStorage.clear();
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
      <MasterDropdownProvider>
        <RoleProvider>{children}</RoleProvider>
      </MasterDropdownProvider>
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
