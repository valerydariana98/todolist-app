import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export async function request(
  path,
  options = {}
) {
  try {
    const response = await api({
      url: path,
      method: options.method || "GET",
      data: options.body
        ? JSON.parse(options.body)
        : undefined,
    });

    return response.data.data ??
      response.data;

  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Error en la petición";

    throw error.response
      ? new Error(message)
      : error;
  }
}