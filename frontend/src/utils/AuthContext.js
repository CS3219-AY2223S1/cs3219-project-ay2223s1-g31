import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

const AUTH_KEY = "react_app_auth";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const initialState = {
    username: "",
  };
  const [auth, setAuth] = useState(initialState);

  const clearAuth = () => {
    setAuth(initialState);
    window.localStorage.removeItem(AUTH_KEY);
  };

  useEffect(() => {
    (async () => {
      const storedAuth = window.localStorage.getItem(AUTH_KEY);
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (!!parsedAuth) {
          setAuth(parsedAuth);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
