import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaHome } from "react-icons/fa";
import { logoutSpotify } from "../services/spotifyService";

const Header = () => {
  const { name, clearUser } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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

  return (
    <div
      ref={menuRef}
      style={{
        width: "98%",
        position: "fixed",
        top: "16px",
        zIndex: 1000,
        fontFamily: "bangers",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: isHomePage ? "right" : "space-between",
      }}
    >
{
   !isHomePage && (
    <button
    className="btn bangers-regular"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      padding: "8px 16px",
      borderRadius: "12px",
      color: "rgb(255, 255, 255)",
      fontSize: "0.95rem",
      fontWeight: "500",
      cursor: "pointer",
      boxShadow: "rgba(0, 0, 0, 0.3) 0px 2px 6px",
      backdropFilter: "blur(6px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
    }}
    onClick={() => navigate("../")}
  >
    <FaHome />
  </button>
  )
}    

{
  name && (
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
    position: "relative", // Ensure dropdown is positioned relative to this container
  }}
>
  Welcome, {name}

  {open && (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: "10px",
        padding: "8px 0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        width:"100%"
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
          logoutSpotify();
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
  )
}
    </div>
  );
};

export default Header;