// import { io } from "socket.io-client";
// const URL = import.meta.env.DEV ? "http://localhost:3000" : "http://localhost:3000";
// export const socket = io(URL);



import { io } from "socket.io-client";

const URL = import.meta.env.DEV
//   ? "http://localhost:3000"           
  ? "https://bingo-server-3o35.onrender.com "        // desarrollo
  : "https://bingo-server-3o35.onrender.com";  // producción (Render)

export const socket = io(URL);
