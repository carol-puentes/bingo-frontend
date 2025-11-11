// import React from "react";
// import { BingoCard } from "./types";
// import "./index.css"

// interface Props {
//   card: BingoCard;
//   calledNumbers: number[];
// }

// const letters = ["B", "I", "N", "G", "O"];

// export const BingoCardComponent: React.FC<Props> = ({
//   card,
//   calledNumbers,
// }) => {
//   return (
//     <div className="bingo-card">
//       <div className="header">
//         {letters.map((l) => (
//           <div key={l}>{l}</div>
//         ))}
//       </div>
//       {card.map((row, i) => (
//         <div className="row" key={i}>
//           {row.map((num, j) => (
//             <div
//               key={j}
//               className={`cell ${
//                 num === "FREE" || calledNumbers.includes(num)
//                   ? "marked"
//                   : ""
//               }`}
//             >
//               {num}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };









import React, { useState } from "react";
import { BingoCard } from "./types";
import "./index.css";

interface Props {
  card: BingoCard;
  // Ya no necesitamos calledNumbers para marcar automáticamente
  // calledNumbers?: number[];
}

const letters = ["B", "I", "N", "G", "O"];

export const BingoCardComponent: React.FC<Props> = ({ card }) => {
  const [markedCells, setMarkedCells] = useState<(number | "FREE")[]>(["FREE"]);

  const toggleCell = (num: number | "FREE") => {
    if (num === "FREE") return; // La casilla FREE siempre está marcada
    setMarkedCells((prev) =>
      prev.includes(num)
        ? prev.filter((n) => n !== num) // desmarcar si ya estaba
        : [...prev, num]                // marcar si no estaba
    );
  };

  return (
    <div className="bingo-card">
      <div className="header">
        {letters.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {card.map((row, i) => (
        <div className="row" key={i}>
          {row.map((num, j) => (
            <div
              key={j}
              className={`cell ${markedCells.includes(num) ? "marked" : ""}`}
              onClick={() => toggleCell(num)}
            >
              {num}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
