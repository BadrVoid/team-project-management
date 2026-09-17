import { useEffect, useState } from "react";

export default function Spaces3D() {
  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      const x = (event.clientX / innerWidth) * 2 - 1;
      const y = (event.clientY / innerHeight) * 2 - 1;

      setRotation({
        x: -y * 8,
        y: x * 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="hidden h-48 w-64 items-center justify-center lg:flex">
      <div
        className="relative size-44"
        style={{
          perspective: "900px",
        }}
      >
        {/* Glow */}
        <div className="absolute inset-10 rounded-full bg-primary/20 blur-3xl" />

        {/* 3D Scene */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: `
              perspective(900px)
              rotateX(${rotation.x}deg)
              rotateY(${rotation.y}deg)
            `,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Back Space */}
          <div
            className="absolute left-1/2 top-1/2 h-28 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/20 bg-primary/5 shadow-xl"
            style={{
              transform: "translateZ(-25px) rotate(-6deg)",
            }}
          />

          {/* Middle Space */}
          <div
            className="absolute left-1/2 top-1/2 h-28 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/30 bg-primary/10 shadow-xl"
            style={{
              transform: "translateZ(0px) rotate(4deg)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3">
              <div className="size-2 rounded-full bg-primary/60" />

              <div className="h-2 w-16 rounded-full bg-primary/20" />
            </div>

            {/* Content */}
            <div className="space-y-2 px-4 py-3">
              <div className="h-2 w-full rounded-full bg-primary/15" />
              <div className="h-2 w-3/4 rounded-full bg-primary/10" />

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="h-5 rounded-md bg-primary/10" />
                <div className="h-5 rounded-md bg-primary/20" />
                <div className="h-5 rounded-md bg-primary/10" />
              </div>
            </div>
          </div>

          {/* Front Space */}
          <div
            className="absolute left-1/2 top-1/2 h-28 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/40 bg-card shadow-2xl"
            style={{
              transform: "translateZ(35px) rotate(-3deg)",
            }}
          >
            {/* Top */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                  <div className="size-2 rounded-sm bg-primary" />
                </div>

                <div className="space-y-1">
                  <div className="h-1.5 w-14 rounded-full bg-foreground/20" />
                  <div className="h-1 w-9 rounded-full bg-muted-foreground/20" />
                </div>
              </div>

              <div className="size-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-2 p-3">
              <div className="h-10 rounded-lg border border-border bg-muted/50 p-2">
                <div className="h-1.5 w-6 rounded-full bg-primary/40" />
                <div className="mt-2 h-1 w-10 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="h-10 rounded-lg border border-border bg-muted/50 p-2">
                <div className="h-1.5 w-5 rounded-full bg-primary/30" />
                <div className="mt-2 h-1 w-8 rounded-full bg-muted-foreground/20" />
              </div>
            </div>
          </div>

          {/* Floating Orb */}
          <div
            className="absolute left-1/2 top-1/2 size-3 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]"
            style={{
              transform: "translate3d(90px, -55px, 55px)",
              animation: "spaces-float 3s ease-in-out infinite",
            }}
          />

          {/* Orbit */}
          <div
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
            style={{
              transform: "translate(-50%, -50%) rotateX(65deg) rotateZ(15deg)",
              animation: "spaces-orbit 10s linear infinite",
            }}
          />

          {/* Small Floating Dot */}
          <div
            className="absolute left-5 top-8 size-2 rounded-full bg-primary/50"
            style={{
              animation: "spaces-float-small 4s ease-in-out infinite",
            }}
          />

          <div
            className="absolute bottom-5 right-4 size-1.5 rounded-full bg-primary/40"
            style={{
              animation: "spaces-float-small 3.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes spaces-orbit {
            from {
              transform:
                translate(-50%, -50%)
                rotateX(65deg)
                rotateZ(0deg);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotateX(65deg)
                rotateZ(360deg);
            }
          }

          @keyframes spaces-float {
            0%,
            100% {
              transform: translate3d(90px, -55px, 55px);
            }

            50% {
              transform: translate3d(90px, -65px, 65px);
            }
          }

          @keyframes spaces-float-small {
            0%,
            100% {
              transform: translateY(0);
              opacity: 0.5;
            }

            50% {
              transform: translateY(-8px);
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  );
}
