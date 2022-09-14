import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const contentPages = [
  { name: "Matching", link: "/matching" },
  { name: "Profile", link: "/profile" },
];
const authPages = [
  { name: "Login", link: "/login" },
  { name: "Signup", link: "/signup" },
];

function Layout({ children }) {
  const { auth } = useAuth();
  const pages = auth.username ? contentPages : authPages;

  return (
    <>
      <AppBar position="fixed">
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={"/"}
              sx={{
                mr: 2,
                fontWeight: 700,
                color: "inherit",
                letterSpacing: "0.1rem",
                textDecoration: "none",
              }}
            >
              PeerPrep31
            </Typography>
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  sx={{ my: 2, color: "white", display: "block" }}
                  component={Link}
                  to={page.link}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            {auth.username && <Box>Hi, {auth.username}</Box>}
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        fixed
        sx={{
          padding: "6rem 10px 1rem 10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </Container>
    </>
  );
}

export default Layout;
