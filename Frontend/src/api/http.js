// src/api/http.js
import axios from "axios";

const httpApi = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 50000,
});

export default httpApi;
