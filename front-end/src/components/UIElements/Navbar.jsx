import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar({ isAuthenticated }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              textAlign: "center",
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
            }}>
            ELT Tool
          </Typography>
          {!isAuthenticated && (
            <>
              <Link
                to="/signin"
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: "0 10px",
                }}>
                <Typography variant="h6" noWrap>
                  Sign In
                </Typography>
              </Link>
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "white",
                  margin: "0 10px",
                }}>
                <Typography variant="h6" noWrap>
                  Sign Up
                </Typography>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
