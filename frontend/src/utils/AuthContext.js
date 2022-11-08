import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import axios from "../api/axios";
import { URL_USER_SVC } from "../configs";

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

  const logout = async () => {
    const res = await axios.post(URL_USER_SVC + "/logout");
    console.log(res);
    clearAuth();
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
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
