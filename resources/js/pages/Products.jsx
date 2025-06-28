import React, { useEffect, useState } from "react";
import { Container, Grid, TextField, Button, Card, CardContent, CardMedia, Typography, Box, MenuItem, Alert } from "@mui/material";

export default function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      let url = "http://127.0.0.1:8000/api/products?";
      if (search) url += `search=${search}&`;
      if (category) url += `category=${category}&`;
      if (minPrice) url += `min_price=${minPrice}&`;
      if (maxPrice) url += `max_price=${maxPrice}&`;

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  const addToCart = (product) => {
    const quantity = parseInt(quantities[product.id]) || 1;

    if (quantity <= 0) {
      setError("Quantity must be at least 1");
      return;
    }

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    setError("");
  };

  return (
    <Container>
      <Box className="products-header">
        <Typography variant="h4">Products</Typography>
        <Box className="search-container" sx={{ mt: 2 }}>
          <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ mr: 1 }} />
          <TextField label="Category" select value={category} onChange={(e) => setCategory(e.target.value)} size="small" sx={{ mr: 1 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
          </TextField>
          <TextField label="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} size="small" sx={{ mr: 1 }} />
          <TextField label="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} size="small" sx={{ mr: 1 }} />
          <Button variant="contained" onClick={fetchProducts}>Filter</Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card className="product-card">
              <CardMedia component="img" height="160" image={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="product-image" />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="text.secondary">Price: ${product.price}</Typography>
                <TextField
                  label="Quantity"
                  type="number"
                  size="small"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  sx={{ mt: 1 }}
                />
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
