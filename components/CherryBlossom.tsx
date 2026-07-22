"use client";

const petals = [
  { left: "10%", delay: "0s", size: "1.5rem" },
  { left: "20%", delay: "1s", size: "1.2rem" },
  { left: "35%", delay: "2s", size: "1.8rem" },
  { left: "50%", delay: "0.5s", size: "1.4rem" },
  { left: "65%", delay: "3s", size: "1.6rem" },
  { left: "80%", delay: "1.5s", size: "1.3rem" },
  { left: "25%", delay: "4s", size: "1.7rem" },
  { left: "75%", delay: "2.5s", size: "1.1rem" },
  { left: "15%", delay: "3.5s", size: "1.5rem" },
  { left: "85%", delay: "0.8s", size: "1.4rem" },
  { left: "45%", delay: "1.2s", size: "1.2rem" },
  { left: "55%", delay: "2.8s", size: "1.6rem" },
];

export default function CherryBlossom() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((petal, i) => (
        <span
          key={i}
          className="cherry-petal"
          style={{
            left: petal.left,
            fontSize: petal.size,
            animationDelay: petal.delay,
            animationName: "fall-and-sway",
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}
