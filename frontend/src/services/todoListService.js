import { request } from "../utils/apiClient";

export function getSections() {
  return request("/todolists");
}

export function addSection(title) {
  return request("/todolists", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function deleteSection(id) {
  return request(`/todolists/${id}`, {
    method: "DELETE",
  });
}