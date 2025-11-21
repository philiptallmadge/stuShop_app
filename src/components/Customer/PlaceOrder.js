import React, { useState } from "react";
import { addOrder } from "../../Services/customerService.js";
import { useNavigate, useParams } from "react-router-dom";

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

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const userId = parseJwt(token)?.sub;
    const size = formData.get("size");

    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      grade: formData.get("grade"),
      size: size || "none",
      qty: parseInt(formData.get("qty")) || 1,
      listing_id: selectedListing.id,
      event_name: selectedListing.event_name,
      price: selectedListing.price,
      status: size ? "pending" : "completed",
      owner_id: userId,
    };

    try {
      const response = await addOrder(data, token);

      if (response.message === "Order created successfully") {
        alert("Order submitted successfully!");
        e.target.reset();
        navigate("/customer"); // go back
      } else {
        alert("Error submitting order.");
      }
    } catch (err) {
      console.error("Order creation error:", err);
    }
  };

  if (!selectedListing)
    return <p>Error: No listing selected</p>;

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Listing Details</h3>
      <p><strong>Name:</strong> {selectedListing.event_name}</p>
      <p><strong>Price:</strong> ${selectedListing.price}</p>
      <p><strong>Description:</strong> {selectedListing.description}</p>
      <p><strong>Status:</strong> {selectedListing.state}</p>

      <form onSubmit={handleOrderSubmit} style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
        <label>
          First Name:
          <input type="text" name="first_name" required />
        </label>

        <label>
          Last Name:
          <input type="text" name="last_name" required />
        </label>

        <label>
          Grade:
          <input type="text" name="grade" />
        </label>

        <label>
          Size:
          <input type="text" name="size" />
        </label>

        <label>
          Quantity:
          <input type="number" name="qty" min="1" defaultValue="1" />
        </label>

        <button type="submit">Submit Order</button>
      </form>
      <button
        className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition mt-4"
        onClick={() => navigate("/customer/org/" + selectedListing.organization_id)}
      >
        Go back to organization listings
      </button>
    </div>
  );
}
