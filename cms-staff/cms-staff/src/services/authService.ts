import axiosInstance from '@/utils/axiosInstance';

// AuthAPI object containing API methods
const AuthAPI = {
  // Method to get the current user
  getCurrentUser(token: string) {
    const url = '/api/auth/get-current-user';
    return axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  // Method to login
  login(email: string, password: string) {
    const url = '/api/auth/login';
    return axiosInstance.post(url, { email, password });
  },
  // Method to register a new user
  register(formData: any) {
    const url = '/api/auth/register';
    return axiosInstance.post(url, formData);
  },
};

export default AuthAPI;
