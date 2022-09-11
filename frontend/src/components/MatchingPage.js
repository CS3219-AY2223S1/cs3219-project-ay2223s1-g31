import { Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { URL_USER_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";

function MatchingPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(URL_USER_SVC + "/protected")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  const logout = async () => {
    try {
      const res = await axios.post(URL_USER_SVC + "/logout");
      console.log(res);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Typography variant={"h3"} mb={"2rem"}>
        Matching Page
      </Typography>
      <div>{JSON.stringify(auth)}</div>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

export default MatchingPage;
