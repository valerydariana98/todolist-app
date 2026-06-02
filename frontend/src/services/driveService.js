import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getGoogleAuthUrl() {
  const res = await api.get("/auth/google/drive");
  return res.data.url;
}

export async function getFiles(taskId) {
  const res = await api.get(`/tasks/${taskId}/files`);
  return res.data.data;
}

export async function uploadFile(taskId, file, accessToken) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("accessToken", accessToken);

  const res = await api.post(`/tasks/${taskId}/files`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function deleteFile(taskId, fileId, accessToken) {
  const res = await api.delete(`/tasks/${taskId}/files/${fileId}`, {
    data: { accessToken },
  });
  return res.data;
}