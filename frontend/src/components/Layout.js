import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../utils/AuthContext";
import { stringAvatar } from "../utils/avatar-utils";
import { useDarkTheme } from "../theme/ThemeContextProvider";

const contentPages = [
  { name: "Matching", link: "/matching" },
  { name: "Profile", link: "/profile" },
];
const authPages = [
  { name: "Login", link: "/login" },
  { name: "Signup", link: "/signup" },
];

function Layout({ children }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isDarkTheme, changeToDarkTheme } = useDarkTheme();
  const menuOpen = !!anchorEl;
  const { auth, logout } = useAuth();
  const pages = auth.username ? contentPages : authPages;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoggingOut = async () => {
    setAnchorEl(null);
    try {
      logout();
      navigate("/login");
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
      console.log(err);
    }
  };

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
            {auth.username && (
              <Box display={"flex"} gap={1} alignItems={"center"}>
                <span>Hi, {auth.username}</span>
                <IconButton onClick={handleAvatarClick}>
                  <Avatar
                    {...stringAvatar(auth.username, {
                      width: 30,
                      height: 30,
                      fontSize: 14,
                    })}
                  />
                </IconButton>
                <Menu
                  open={menuOpen}
                  anchorEl={anchorEl}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <MenuItem component={NavLink} to={"/profile"} replace>
                    <ListItemIcon>
                      <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => changeToDarkTheme(!isDarkTheme)}>
                    <ListItemIcon>
                      {isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
                    </ListItemIcon>
                    <ListItemText>
                      {isDarkTheme
                        ? "Switch to light theme"
                        : "Switch to dark theme"}
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLoggingOut}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            )}
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
