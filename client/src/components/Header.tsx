// src/components/Header.tsx
import { useEffect, useState } from "react";

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("spotify_user_name");
    if (name) {
      setUsername(name);
    }
  }, []);

  return (
    <header className="d-flex justify-content-end align-items-center p-3 bg-transparent position-relative">
      {username && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)", // subtle transparent box
            padding: "6px 12px",
            borderRadius: "12px",
            color: "#ffff", // softer white
            fontSize: "0.9rem",
            fontWeight: 500,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // soft shadow for depth
          }}
        >
          Welcome, {username}
        </div>
      )}
    </header>
  );
};

export default Header;
