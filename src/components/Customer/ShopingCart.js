import React, { useEffect, useState } from "react";
import { addOrder } from "../../Services/customerService.js";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);
  console.log(cartItems);

  // Save new cart state into localStorage
  const updateCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
  };

  const handleDelete = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const handleQuantityChange = (index, newQty) => {
    if (newQty < 1) return; // don't allow 0 or negative

    const newCart = [...cartItems];
    newCart[index].qty = newQty;

    updateCart(newCart);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmitAll = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("You must be logged in.");

    try {
      for (const item of cartItems) {
        await addOrder(item, token);
      }

      localStorage.removeItem("cart");
      setCartItems([]);

      alert("All orders submitted!");
      navigate("/customer");
    } catch (err) {
      console.error("Error submitting orders:", err);
      alert("There was an error submitting your cart.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
  <p>Your cart is empty.</p>
) : (
  <>
    {cartItems.map((item, idx) => (
      <div key={idx} style={{ marginBottom: "20px" }}>
        <h3>{item.event_name}</h3>
        <p>Description: {item.description}</p>
        <p>Price: ${item.price}</p>

        {/* Quantity Controls */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>Qty:</span>

          <button
            onClick={() => handleQuantityChange(idx, item.qty - 1)}
            className="px-2 bg-gray-300 rounded"
          >
            -
          </button>

          <input
            type="number"
            value={item.qty}
            min="1"
            onChange={(e) =>
              handleQuantityChange(idx, parseInt(e.target.value))
            }
            style={{ width: "60px", textAlign: "center" }}
          />

          <button
            onClick={() => handleQuantityChange(idx, item.qty + 1)}
            className="px-2 bg-gray-300 rounded"
          >
            +
          </button>

          <button
            onClick={() => handleDelete(idx)}
            className="px-3 bg-red-400 rounded text-white"
          >
            Delete
          </button>
        </div>

        {/* SIZE EDITING */}
        {item.size !== "none" && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span>Size:</span>

            <input
              type="text"
              value={item.size}
              onChange={(e) => {
                const newCart = [...cartItems];
                newCart[idx].size = e.target.value;
                updateCart(newCart);
              }}
              style={{ width: "80px", textAlign: "center" }}
            />
          </div>
        )}
      </div>
    ))}

    <h3 style={{ marginTop: "20px" }}>Total: ${total}</h3>

    <button
      onClick={handleSubmitAll}
      className="bg-blue-600 text-white px-6 py-3 rounded-full mt-4 hover:bg-blue-700"
    >
      Submit All Orders
    </button>
  </>
)}

      <button
        onClick={() => navigate("/customer")}
        className="mt-6 px-6 py-3 bg-gray-300 rounded hover:bg-gray-400"
      >
        Go to Organizations
      </button>
    </div>
  );
}


