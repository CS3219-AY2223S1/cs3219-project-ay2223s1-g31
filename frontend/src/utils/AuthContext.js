import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

const AUTH_KEY = "react_app_auth";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    username: "",
  });

  useEffect(() => {
    const storedAuth = window.localStorage.getItem(AUTH_KEY);
    try {
      const parsedAuth = JSON.parse(storedAuth);
      if (!!parsedAuth) {
        setAuth(parsedAuth);
      }
    } catch (err) {
      console.log("Access token error!");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
