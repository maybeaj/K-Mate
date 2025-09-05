// src/api/client.ts
import axios from 'axios'
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true, //쿠키를 포함하여 요청을 보냄
})
