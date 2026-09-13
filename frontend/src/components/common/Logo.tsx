export function Logo() {
  return (
    <div className="flex items-center gap-4">
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="56" height="56" rx="16" className="fill-primary" />

        <path
          d="M17 18H39"
          className="stroke-primary-foreground"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <path
          d="M17 28H33"
          className="stroke-primary-foreground"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <path
          d="M17 38H39"
          className="stroke-primary-foreground"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <circle cx="37" cy="28" r="5" className="fill-accent" />

        <circle cx="37" cy="28" r="2" className="fill-accent-foreground" />
      </svg>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">TeamFlow</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Project management
        </p>
      </div>
    </div>
  );
}
