import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Hardcoded users — in production, use a backend
const USERS = [
  { id: 'admin', name: 'Admin', role: 'admin', username: 'admin', password: 'admin@123' },
  { id: 're001', name: 'Prince Gupta', role: 'staff', username: 'Prince', password: 'Prince@123' },
  { id: 're002', name: 'Muskan Singh', role: 'staff', username: 'Muskan', password: 'Muskan@123' },
  { id: 're003', name: 'Meena Gupta', role: 'staff', username: 'Meena', password: 'Meena@123' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crm_user');
    return saved ? JSON.parse(saved): null;
  });

  const login = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('crm_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, allStaff: USERS.filter(u => u.role === 'staff') }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
