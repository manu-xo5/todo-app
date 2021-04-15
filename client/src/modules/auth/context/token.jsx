import { createContext, useContext, useState } from "react";

const initialTokenContext = () => localStorage.getItem("token");
const TokenContext = createContext(initialTokenContext);

function TokenProvider({ children }) {
  const [token, setToken] = useState(initialTokenContext);

  return (
    <TokenContext.Provider
      value={{
        token,
        setToken: (value) => {
          localStorage.setItem("token", value);
          setToken(value);
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

function useToken() {
  return useContext(TokenContext);
}

export { TokenProvider, useToken };
