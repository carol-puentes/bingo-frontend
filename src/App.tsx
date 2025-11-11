
import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import { BingoCardComponent } from "./BingoCard";
import { BingoCard, CalledNumber } from "./types";

function generateBingoCard(): BingoCard {
  const ranges = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75],
  };

  const card: (number | "FREE")[][] = [];
  const letters = Object.keys(ranges);

  for (let l of letters) {
    const [start, end] = ranges[l];
    const nums = Array.from({ length: 15 }, (_, i) => start + i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    card.push(nums);
  }

  // Casilla central “FREE”
  card[2][2] = "FREE";

  // Transponer la matriz para obtener filas horizontales
  return card[0].map((_, i) => card.map((col) => col[i]));
}

export default function App() {
  const [role, setRole] = useState<"admin" | "player" | null>(null);
  const [card, setCard] = useState<BingoCard | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<CalledNumber[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastNumber, setLastNumber] = useState<CalledNumber | null>(null);
  const [roomId, setRoomId] = useState("room1");
  const [name, setName] = useState("");

  useEffect(() => {
    socket.on("init-data", (data) => {
      setCalledNumbers(data.calledNumbers);
    });

    socket.on("number-called", (called: CalledNumber) => {
      setCalledNumbers((prev) => [...prev, called]);
      setLastNumber(called);
    });

    socket.on("bingo-winner", ({ id }) => {
      setWinner(id);
    });

    socket.on("invalid-bingo", () => {
      alert("❌ Tu bingo no es válido.");
    });

    socket.on("admin-exists", () => {
      alert("Ya hay un administrador activo.");
      setRole(null);
    });

    socket.on("admin-left", () => {
      alert("El administrador salió, la partida se reinició.");
      window.location.reload();
    });

    socket.on("system-message", (msg: string) => console.log(msg));
    socket.on("error-room", (msg: string) => alert(msg));

    return () => {
      socket.off();
    };
  }, []);

  const handleRoleSelect = (r: "admin" | "player") => {
    if (r === "admin") {
      socket.emit("create-room", roomId);
      setRole("admin");
    } else {
      if (!name || !roomId) return alert("Completa el nombre y sala");
      socket.emit("join-room", roomId, name);
      setRole("player");
      setCard(generateBingoCard());
    }
  };

  const handleNextNumber = () => {
    if (role === "admin") socket.emit("call-number", roomId);
  };

  const handleCheckBingo = () => {
    if (card) socket.emit("player-bingo", roomId, name, card);
  };

  if (!role)
    return (
      <div className="container">
        <h1>Bingo Multijugador 🎲</h1>

        <label>ID de sala:</label>
        <input
          className="input"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <br />

        <label>Tu nombre:</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />

        <button onClick={() => handleRoleSelect("admin")}>Administrador</button>
        <button onClick={() => handleRoleSelect("player")}>Jugador</button>
      </div>
    );

  return (
    <div className="container">
      <h1>Bingo en vivo 🎉 — Sala: {roomId}</h1>

      {winner && <h2>🎊 ¡El jugador {winner} ha ganado! 🎊</h2>}

      {role === "admin" && (
        <>
          <h3>Último número:</h3>
          {lastNumber ? (
            <h1 className="big-number">
              {lastNumber.letter}
              {lastNumber.number}
            </h1>
          ) : (
            <p>-</p>
          )}

          <h3>Números llamados:</h3>
          <div className="numbers-grid">
            {calledNumbers.map((n, i) => (
              <span key={i} className="number-cell">
                {n.letter}
                {n.number}
              </span>
            ))}
          </div>

          <button onClick={handleNextNumber}>Sacar número</button>
        </>
      )}

      {role === "player" && card && (
        <>
          <BingoCardComponent
            card={card}
            calledNumbers={calledNumbers.map((n) => n.number)}
          />
          <p>
            Último número:{" "}
            {lastNumber ? (
              <strong>
                {lastNumber.letter}
                {lastNumber.number}
              </strong>
            ) : (
              "-"
            )}
          </p>
          <button onClick={handleCheckBingo}>¡Cantar BINGO!</button>
        </>
      )}
    </div>
  );
}
