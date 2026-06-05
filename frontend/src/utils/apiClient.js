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
    console.log(error.response?.data);
    const data = error.response?.data;

    let message =
      "Error en la petición";

    if (Array.isArray(data)) {
      message = data
        .map((e) => e.message)
        .join(" ");
    } else if (
      Array.isArray(data?.errors)
    ) {
      message = data.errors
        .map((e) => e.message)
        .join(" ");
    } else if (
      data?.error?.message
    ) {
      message =
        data.error.message;
    } else if (
      data?.message
    ) {
      try {
        const parsed =
          JSON.parse(data.message);

        if (
          Array.isArray(parsed)
        ) {
          message = parsed
            .map(
              (e) => e.message
            )
            .join(" ");
        } else {
          message =
            data.message;
        }
      } catch {
        message =
          data.message;
      }
    }

    throw new Error(message, {
      cause: error,
    });
  }
}