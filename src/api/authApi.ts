import axiosInstance from "@/api/axios-config";

const AuthAPI = {
  getCurrentUser(token: string) {
    const url = "/api/auth/get-current-user";
    return axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  login(email: string, password: string) {
    const url = "/api/auth/login";
    return axiosInstance.post(url, { email, password });
  },
  register(formData: any) {
    const url = "/api/auth/register";
    return axiosInstance.post(url, formData);
  },
};
export default AuthAPI;
