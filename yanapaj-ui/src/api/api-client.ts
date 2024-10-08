import { createClient, createConfig } from "@hey-api/client-axios";
import { client as generatedClient } from "@/client"; // Import the generated client

const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Create a custom client instance based on the generated client
export const apiClient = createClient(
  createConfig({
    withCredentials: true, // Important for CORS with credentials
  }),
);

// Optionally, copy over any custom configurations from the generated client
apiClient.setConfig(generatedClient.getConfig());

apiClient.instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Get the token on each request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem("token");
      console.log("You are logged out!!!");
    }
    return Promise.reject(error);
  },
);
