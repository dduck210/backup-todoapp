import axios from "axios";

const API_URL = "https://todo-backend-6c6i.onrender.com/todos";
export const getTodos = () => axios.get(API_URL);
export const addTodo = (todo) => axios.post(API_URL, todo);
export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`);
export const updateTodo = (id, todo) => axios.put(`${API_URL}/${id}`, todo);
