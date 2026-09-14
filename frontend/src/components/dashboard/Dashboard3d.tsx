import { useEffect, useState } from "react";

export default function Dashboard3D() {
  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      // Normalize cursor position from -1 to 1
      const x = (event.clientX / innerWidth) * 2 - 1;
      const y = (event.clientY / innerHeight) * 2 - 1;

      // Keep movement subtle
      setRotation({
        x: -y * 10,
        y: x * 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="hidden h-32 w-44 items-center justify-center sm:flex">
      <div
        className="relative size-28"
        style={{
          perspective: "800px",
        }}
      >
        {/* Glow */}
        <div className="absolute inset-5 rounded-full bg-primary/20 blur-2xl" />

        {/* 3D container */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: `
              perspective(800px)
              rotateX(${rotation.x}deg)
              rotateY(${rotation.y}deg)
            `,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Orb */}
          <div
            className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/5 shadow-[0_0_35px_hsl(var(--primary)/0.25)]"
            style={{
              transform: "translateZ(25px)",
            }}
          >
            {/* Vertical grid */}
            <div
              className="absolute inset-0 rounded-full border border-primary/20"
              style={{
                transform: "rotateY(35deg)",
              }}
            />

            <div
              className="absolute inset-0 rounded-full border border-primary/20"
              style={{
                transform: "rotateY(-35deg)",
              }}
            />

            {/* Horizontal grid */}
            <div
              className="absolute inset-0 rounded-full border border-primary/20"
              style={{
                transform: "rotateX(35deg)",
              }}
            />

            <div
              className="absolute inset-0 rounded-full border border-primary/20"
              style={{
                transform: "rotateX(-35deg)",
              }}
            />

            {/* Center */}
            <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
          </div>

          {/* Orbit */}
          <div
            className="absolute inset-1 rounded-full border border-primary/30"
            style={{
              transform: "rotateX(65deg) rotateZ(15deg)",
              animation: "dashboard-orbit 8s linear infinite",
            }}
          />

          {/* Second orbit */}
          <div
            className="absolute inset-3 rounded-full border border-primary/15"
            style={{
              transform: "rotateX(65deg) rotateZ(-25deg)",
              animation: "dashboard-orbit-reverse 10s linear infinite",
            }}
          />

          {/* Floating dot */}
          <div
            className="absolute left-1/2 top-1 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
            style={{
              animation: "dashboard-float 3s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes dashboard-orbit {
            from {
              transform: rotateX(65deg) rotateZ(0deg);
            }

            to {
              transform: rotateX(65deg) rotateZ(360deg);
            }
          }

          @keyframes dashboard-orbit-reverse {
            from {
              transform: rotateX(65deg) rotateZ(360deg);
            }

            to {
              transform: rotateX(65deg) rotateZ(0deg);
            }
          }

          @keyframes dashboard-float {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-6px);
            }
          }
        `}
      </style>
    </div>
  );
}
