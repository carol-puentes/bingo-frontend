// import { io } from "socket.io-client";
// const URL = import.meta.env.DEV ? "http://localhost:3000" : "http://localhost:3000";
// export const socket = io(URL);



import { io } from "socket.io-client";

const URL = import.meta.env.DEV
  ? "http://localhost:3000"                   // desarrollo
  : "https://bingo-server-3o35.onrender.com";  // producción (Render)

export const socket = io(URL);
// Aquí agregas los logs
socket.on("connect", () => console.log("✅ Conectado al servidor", socket.id));
socket.on("disconnect", () => console.log("❌ Desconectado del servidor"));
socket.on("system-message", (msg: string) => console.log("💬", msg));
socket.on("error-room", (msg: string) => console.log("⚠️", msg));