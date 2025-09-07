import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  timeout: 15000,
});

export default http;
