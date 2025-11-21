import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListingForOrganization } from "../../Services/organizationService.js";
import styles from "./AddingListing.module.css"

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Create a New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Closure Date</label>
            <input
              type="date"
              value={dateClosure}
              onChange={(e) => setDateClosure(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}

