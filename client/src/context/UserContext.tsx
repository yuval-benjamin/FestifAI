import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  name: string | null;
  email: string | null;
  setUser: (name: string, email: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const setUser = (newName: string, newEmail: string) => {
    setName(newName);
    setEmail(newEmail);
  };

  return (
    <UserContext.Provider value={{ name, email, setUser }}>
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
