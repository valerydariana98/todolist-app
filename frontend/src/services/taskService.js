import { request } from "../utils/apiClient";

export function getTasks() {
  return request("/tasks");
}

export function addTask(todoList, title) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify({
      title,
      todoList,
    }),
  });
}

export function toggleTask(id) {
  return request(`/tasks/${id}/completed`, {
    method: "PATCH",
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}