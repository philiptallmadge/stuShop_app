import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListingForOrganization } from "../../Services/organizationService.js";
import styles from "./AddingListing.module.css";

export default function AddingListing() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [dateClosure, setDateClosure] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const orgId = JSON.parse(atob(token.split(".")[1])).sub; // get org id from JWT

      const newListing = {
        event_name: title,
        description,
        price,
        qty: qty || null,
        date_closure: dateClosure || null,
      };

      await createListingForOrganization(orgId, newListing, token);

      alert("Listing created successfully!");
      navigate("/organization"); // go back to organization page
    } catch (err) {
      console.error(err);
      alert("Error creating listing");
    }
  };

 return (
    <div className={styles.container}>
      {/* Replaced: bg-white p-8 rounded-2xl shadow-md w-96 text-center */}
      <div className={styles.card}>
        {/* Replaced: text-2xl font-bold mb-4 */}
        <h1 className={styles.header}>Create a New Listing</h1>
        {/* Replaced: space-y-4 text-left */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            {/* Replaced: block font-semibold */}
            <label className={styles.label}>Title</label>
            {/* Replaced: w-full border px-3 py-2 rounded */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Description</label>
            {/* Replaced: w-full border px-3 py-2 rounded */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className={styles.inputField}
            />
          </div>

          <div>
            <label className={styles.label}>Closure Date</label>
            <input
              type="date"
              value={dateClosure}
              onChange={(e) => setDateClosure(e.target.value)}
              className={styles.inputField}
            />
          </div>

          {/* Replaced: bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition */}
          <button
            type="submit"
            className={styles.submitButton}
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}