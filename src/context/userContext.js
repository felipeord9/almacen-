import { useState, createContext } from "react";

const Context = createContext({});

export function UserContextProvider({ children }) {
  const [colaborator, setColaborator] = useState(null);

  const getColaborator = (colab) => {
    setColaborator(colab);
  };

  return (
    <Context.Provider value={{ colaborator, getColaborator, setColaborator }}>{children}</Context.Provider>
  );
}

export default Context;
