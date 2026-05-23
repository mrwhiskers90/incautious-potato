export default function HomePage() {
  return (
    <main
      style={{
        background: "#888",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <img
        src="/api/dashboard"
        width={800}
        height={600}
        style={{
          border: "2px solid black",
          background: "white",
        }}
      />
    </main>
  );
}