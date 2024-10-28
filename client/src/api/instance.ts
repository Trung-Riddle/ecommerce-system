// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_SERVER_URI,
// });

// const getAccessToken = () => localStorage.getItem("accessToken");
// const getRefreshToken = () => localStorage.getItem("refreshToken");

// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       error.response.data.Unauthorized &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = getRefreshToken();
//         if (!refreshToken) {
//           localStorage.removeItem("accessToken");
//           return Promise.reject(
//             new Error("No refresh token available. Please log in again.")
//           );
//         }

//         const { data } = await api.post("/auth/refresh-token", {
//           refreshToken,
//         });

//         localStorage.setItem("accessToken", data.accessToken);
//         localStorage.setItem("refreshToken", data.refreshToken);

//         // Cập nhật header với token mới và gửi lại request
//         originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError: any) {

//         return Promise.reject(refreshError);
//       }
//     }

//     if (error.response && error.response.status === 403 && error.response.data.TokenFailed) {
//       localStorage.removeItem('accessToken');
//       return Promise.reject(new Error('Token expired. Please log in again.'));
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios, { AxiosError } from "axios";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface ErrorResponse {
  Unauthorized?: boolean;
  TokenFailed?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
});

// Tránh nhiều refresh token requests cùng lúc
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const getTokens = () => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
});

const setTokens = (tokens: AuthResponse) => {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
};

// Thêm token vào request
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Xử lý token hết hạn
    if (
      error.response?.status === 401 &&
      error.response.data?.Unauthorized &&
      !originalRequest.headers["retried"]
    ) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào hàng đợi
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            originalRequest.headers["retried"] = true;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { refreshToken } = getTokens();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await api.post<AuthResponse>("/auth/refresh-token", {
          refreshToken,
        });

        setTokens(data);
        
        // Thực thi các request đang chờ
        refreshSubscribers.forEach((cb) => cb(data.accessToken));
        refreshSubscribers = [];

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        originalRequest.headers["retried"] = true;
        
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý refresh token hết hạn
    if (error.response?.status === 403 && error.response.data?.TokenFailed) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return Promise.reject(new Error("Token expired"));
    }

    return Promise.reject(error);
  }
);

export default api;
