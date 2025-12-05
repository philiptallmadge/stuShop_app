import React, { useEffect, useState } from "react";
import { addOrder } from "../../Services/customerService.js";
import { useNavigate } from "react-router-dom";
import styles from "./ShoppingCart.module.css";

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
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.pageTitle}>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate("/customer")}
              className={styles.backButton}
              style={{ marginTop: "1.5rem" }}
            >
              Go to Organizations
            </button>
          </div>
        ) : (
          <div className={styles.twoColumnLayout}>
            {/* LEFT - Cart Items */}
            <div className={styles.leftSection}>
              <div className={styles.cartItemsContainer}>
                {cartItems.map((item, idx) => (
                  <div key={idx} className={styles.cartItem}>
                    <h3>{item.event_name}</h3>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Price:</strong> ${item.price}</p>

                    {/* Quantity Controls */}
                    <div className={styles.quantityControls}>
                      <span>Qty:</span>
                      <button
                        onClick={() => handleQuantityChange(idx, item.qty - 1)}
                        className={styles.quantityButton}
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
                        className={styles.quantityInput}
                      />
                      <button
                        onClick={() => handleQuantityChange(idx, item.qty + 1)}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>

                    {/* SIZE EDITING */}
                    {item.size !== "none" && (
                      <div className={styles.sizeEditor}>
                        <span>Size:</span>
                        <input
                          type="text"
                          value={item.size}
                          onChange={(e) => {
                            const newCart = [...cartItems];
                            newCart[idx].size = e.target.value;
                            updateCart(newCart);
                          }}
                          className={styles.sizeInput}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - Checkout Summary */}
            <div className={styles.rightSection}>
              <div className={styles.checkoutCard}>
                <h3>Order Summary</h3>
                
                <div className={styles.totalSection}>
                  <span className={styles.totalLabel}>Total:</span>
                  <span className={styles.totalAmount}>${total.toFixed(2)}</span>
                </div>

                <div className={styles.checkoutButtons}>
                  <button onClick={handleSubmitAll} className={styles.submitButton}>
                    Submit All Orders
                  </button>
                  <button
                    onClick={() => navigate("/customer")}
                    className={styles.backButton}
                  >
                    Go to Organizations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}