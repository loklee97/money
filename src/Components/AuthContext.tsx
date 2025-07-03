import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  user: string | null;
  money: number | 0;
  login: (user: string, money: number) => void;
  logout: () => void;
  resetMoney: (money: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('user');
  });

  const [money, setMoney] = useState<number>(() => {
    const stored = localStorage.getItem('money');
    return stored !== null ? parseFloat(stored) : 0;
  });
  const login = (username: string, money: number) => {
    setUser(username);
    setMoney(money);
    localStorage.setItem('user', username);//save data in cache
    localStorage.setItem('money', money.toString());
  };
  const resetMoney = (money: number) => {
    setMoney(money);
    localStorage.setItem('money', money.toString());
  };
  const logout = () => {
    setUser('');//clear cache and user
    setMoney(0);
    localStorage.removeItem('user');
    localStorage.removeItem('money');
  };
  return (
    <AuthContext.Provider value={{ user: user, login, logout, money, resetMoney }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
