import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left: Logo and title */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src="/imgs/izam_logo_white.png" alt="Logo" style={{ height: 40, marginRight: 8, }} />
          {/* <Typography variant="h6" color="text.primary">
            E-Shop
          </Typography> */}
        </Box>

        {/* Center: Search Icon */}
        <IconButton color="inherit" onClick={() => navigate("/products")}>
          <SearchIcon />
        </IconButton>

        {/* Right: Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge badgeContent={0} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {token ? (
            <>
              <Button color="primary" onClick={() => navigate("/add-product")}>
                Add Product
              </Button>
              <Button color="primary" onClick={() => navigate("/products")}>
                Products
              </Button>
              <Button color="primary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="primary" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
