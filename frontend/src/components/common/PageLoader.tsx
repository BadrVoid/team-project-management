export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 ">
      <div
        className="absolute h-12 w-12 animate-spin rounded-full border-4 border-transparent"
        style={{
          borderTopColor: "var(--primary, #f2765e)",
          borderRightColor: "var(--secondary, #315b8c)",
        }}
      />
    </div>
  );
}
