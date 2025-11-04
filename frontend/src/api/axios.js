// frontend/src/api/axios.js
import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ backend URL (Spring Boot)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
