import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserContextType {
  name: string | null;
  email: string | null;
  setUser: (name: string, email: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    const savedEmail = localStorage.getItem("user_email");
    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
    }
  }, []);

  const setUser = (newName: string, newEmail: string) => {
    setName(newName);
    setEmail(newEmail);
    localStorage.setItem("user_name", newName);
    localStorage.setItem("user_email", newEmail);
  };

  const clearUser = () => {
    setName(null);
    setEmail(null);
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
  };

  return (
    <UserContext.Provider value={{ name, email, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
