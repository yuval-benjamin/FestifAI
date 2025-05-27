import { useUser } from "../context/UserContext";

const Header = () => {
  const { name } = useUser();

  if (!name) return null;

  return (
    <div style={{
      position: "fixed",
      top: "16px",
      right: "16px",
      zIndex: 1000,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      padding: "8px 16px",
      borderRadius: "12px",
      color: "#fff",
      fontSize: "0.95rem",
      fontWeight: 500,
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      pointerEvents: "none",
      fontFamily: "bangers",
    }}>
      Welcome, {name}
    </div>
  );
};

export default Header;
