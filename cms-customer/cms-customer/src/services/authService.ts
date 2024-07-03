import axiosInstance from "@/utils/axiosInstance";

const AuthAPI = {
  getCurrentUser(token: string) {
    return axiosInstance.get("/api/auth/get-current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  login(email: string, password: string) {
    return axiosInstance.post("/api/auth/login", { email, password });
  },
  register(formData: any) {
    return axiosInstance.post("/api/auth/register", formData);
  },
};

export default AuthAPI;
