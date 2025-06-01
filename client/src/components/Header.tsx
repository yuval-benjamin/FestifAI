import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { name } = useUser();

  if (!name) return null;

  return (
    <Link
      to="/artists"
      style={{
        textDecoration: "none",
        color: "inherit",
        pointerEvents: "auto",
      }}
    >
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
        pointerEvents: "auto",
        fontFamily: "bangers",
        cursor: "pointer"
      }}>
        Welcome, {name}
      </div>
    </Link>
  );
};

export default Header;
