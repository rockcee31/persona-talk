import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [started, setStarted] = useState(false);
  const [persona, setPersona] = useState(null); // Add persona state here

  return (
    <AppContext.Provider value={{ started, setStarted, persona, setPersona }}>
      {children}
    </AppContext.Provider>
  );
};

