import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../css/AddProduct.css";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !stock || !category || !image) {
      setError("Please fill in all fields and select an image.");
      return;
    }

    const token = localStorage.getItem("token");

    console.log("Token:", token); // لمساعدتك في التحقق

    if (!token) {
      setError("Authentication token missing. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        navigate("/products");
      } else if (data.errors) {
        const firstError = Object.values(data.errors)[0][0];
        setError(firstError);
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Something went wrong. Please check the server.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please check the console for details.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }} className="add-product-container">
        <Typography variant="h4" align="center" gutterBottom>Add Product</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <TextField
          label="Stock"
          type="number"
          fullWidth
          margin="normal"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <TextField
          label="Category"
          select
          fullWidth
          margin="normal"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
          <MenuItem value="Books">Books</MenuItem>
        </TextField>

        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>
    </Container>
  );
}
