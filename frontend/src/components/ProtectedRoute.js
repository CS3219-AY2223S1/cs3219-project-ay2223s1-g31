import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../api/axios";
import { URL_USER_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";

const REDIRECT_URL = "/login";
const VERIFY_TOKEN_ROUTE = URL_USER_SVC + "/verifyToken";

function ProtectedRoute() {
  const { setAuth } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.post(VERIFY_TOKEN_ROUTE);
        console.log(res.data);
        setAuth(res.data);
        setIsAuth(true);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsAuth(false);
        enqueueSnackbar("Please login again!", { variant: "warning" });
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate replace to={REDIRECT_URL} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
