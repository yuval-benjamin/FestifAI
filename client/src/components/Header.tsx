import { useEffect, useState } from "react";

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);

  const updateUsername = () => {
    const name = localStorage.getItem("spotify_user_name");
    if (name && name.trim() !== "") {
      setUsername(name);
    } else {
      setUsername(null);
    }
  };

  useEffect(() => {
    updateUsername();

    const handleUsernameUpdate = () => updateUsername();

    window.addEventListener("spotify_user_name_updated", handleUsernameUpdate);
    return () =>
      window.removeEventListener("spotify_user_name_updated", handleUsernameUpdate);
  }, []);

  if (!username) return null;

  return (
    <div
      style={{
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
        pointerEvents: "none", // makes sure it doesn't block clicks underneath
      }}
    >
      Welcome, {username}
    </div>
  );
};

export default Header;
