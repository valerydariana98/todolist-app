const API_URL = import.meta.env.VITE_API_URL;

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Error en la petición"
    );
  }

  return data.data ?? data;
}