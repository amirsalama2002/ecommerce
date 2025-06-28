import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";

export default function Cart({ cart, clearCart }) {

  const handleSendOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Order sent to email successfully!");
        clearCart();
      } else {
        alert(data.message || "Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Your Cart</Typography>

      {cart.length > 0 ? (
        <>
          {cart.map((item) => (
            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography>{item.name} (x{item.quantity})</Typography>
              <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
          ))}
          <Typography sx={{ mt: 2 }} variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>

          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSendOrder}>
            Send Order to Email
          </Button>
        </>
      ) : (
        <Typography sx={{ mt: 2 }}>Your cart is empty.</Typography>
      )}
    </Container>
  );
}