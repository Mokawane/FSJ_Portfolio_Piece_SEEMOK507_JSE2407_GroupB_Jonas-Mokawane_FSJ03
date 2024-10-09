"use client";

import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChange } from '../../lib/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => unsubscribe(); // Clean up the subscription
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
