const API_BASE_URL = "http://129.74.153.235:5001"
//const API_BASE_URL = "http://localhost:5000"

//import axios from "axios";

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API Error ${response.status}: ${message}`);
  }

  return await response.json();
}
