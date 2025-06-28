import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Card, CardContent, CircularProgress, Alert, Button } from "@mui/material";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setOrder(data);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Order Details (#{order.id})</Typography>

      <Box sx={{ mt: 2 }}>
        {order.products && order.products.length > 0 ? (
          order.products.map((product) => (
            <Card key={product.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>Quantity: {product.quantity}</Typography>
                <Typography>Price per item: ${product.price}</Typography>
                <Typography>Total: ${(product.price * product.quantity).toFixed(2)}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No products found in this order.</Typography>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Order Price: ${order.total.toFixed(2)}
        </Typography>

        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Box>
    </Container>
  );
}
