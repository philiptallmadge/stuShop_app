import React, { useState } from "react";
import { addOrder } from "../../Services/customerService.js";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PlaceOrder.module.css";

export default function PlaceOrder() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  
  // Retrieve listing from localStorage
  const [selectedListing] = useState(
    JSON.parse(localStorage.getItem("selectedListing"))
  );

  function parseJwt(token) {
    try { return JSON.parse(atob(token.split(".")[1])); }
    catch { return null; }
  }

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const userId = parseJwt(token)?.sub;
    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      grade: formData.get("grade"),
      size: formData.get("size") || "none",
      qty: parseInt(formData.get("qty")) || 1,
      listing_id: selectedListing.id,
      event_name: selectedListing.event_name,
      price: selectedListing.price,
      description: selectedListing.description,
      status: "pending",
      owner_id: userId,
    };

    // --- Save to shopping cart ---
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(data);
    localStorage.setItem("cart", JSON.stringify(cart));
    
    alert("Item added to cart!");
    e.target.reset();
    navigate("/customer/cart");
  };

  if (!selectedListing)
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>Error: No listing selected</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Top Right Buttons */}
        <div className={styles.topButtonContainer}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/customer/org/" + selectedListing.organization_id)}
          >
            Listings
          </button>
          <button
            className={styles.cartButton}
            onClick={() => navigate("/customer/cart")}
          >
            My Cart 🛒
          </button>
        </div>

        {/* Two Column Layout */}
        <div className={styles.twoColumnLayout}>
          {/* LEFT - Listing Details Card */}
          <div className={styles.listingCard}>
            <h3>Listing Details</h3>
            <div className={styles.listingDetails}>
              <p><strong>Name:</strong> {selectedListing.event_name}</p>
              <p><strong>Price:</strong> ${selectedListing.price}</p>
              <p><strong>Description:</strong> {selectedListing.description}</p>
              <p><strong>Status:</strong> {selectedListing.state}</p>
            </div>
          </div>

          {/* RIGHT - Order Form Card */}
          <div className={styles.formCard}>
            <h3>Place Your Order</h3>
            <form onSubmit={handleOrderSubmit} className={styles.orderForm}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input type="text" name="first_name" required placeholder="Enter your first name" />
              </div>

              <div className={styles.formGroup}>
                <label>Last Name</label>
                <input type="text" name="last_name" required placeholder="Enter your last name" />
              </div>

              <div className={styles.formGroup}>
                <label>Grade</label>
                <input type="text" name="grade" placeholder="e.g. Freshman, Sophomore" />
              </div>

              <div className={styles.formGroup}>
                <label>Size</label>
                <input type="text" name="size" placeholder="e.g. S, M, L, XL" />
              </div>

              <div className={styles.formGroup}>
                <label>Quantity</label>
                <input type="number" name="qty" min="1" defaultValue="1" />
              </div>

              <button type="submit" className={styles.submitButton}>
                Add to Cart
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
