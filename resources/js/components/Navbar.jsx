import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box className="navbar-container">
      <Box className="navbar-left" onClick={() => navigate("/products")}>
        <img src="/imgs/izam_logo_white.png" alt="Logo" className="navbar-logo" />
        <Typography variant="h6" className="navbar-title">E-Shop</Typography>
      </Box>

      <Box className="navbar-right">
        <Button color="primary" onClick={() => navigate("/add-product")}>Add Product</Button>
        <Button color="primary" onClick={() => navigate("/products")}>Products</Button>
        <Button color="primary" onClick={() => navigate("/cart")}>Cart</Button>
        <Button color="primary" onClick={handleLogout}>Logout</Button>

      </Box>
    </Box>
  );
}
