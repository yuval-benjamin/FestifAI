import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Header = () => {

  const { name, clearUser } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!name) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 1000,
        fontFamily: "bangers",
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
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
        }}
      >
        Welcome, {name}
      </div>

      {open && (
        <div
          style={{
            marginTop: "8px",
            backgroundColor: "rgba(0,0,0,0.85)",
            borderRadius: "10px",
            padding: "8px 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Link
            to="/artists"
            style={{
              display: "block",
              padding: "8px 16px",
              textDecoration: "none",
              color: "#fff",
              fontSize: "0.9rem",
            }}
            onClick={() => setOpen(false)}
          >
            Artists Page
          </Link>
          <div
            onClick={() => {
              clearUser();
              navigate("/");
            }}

            style={{
              padding: "8px 16px",
              color: "#fff",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
