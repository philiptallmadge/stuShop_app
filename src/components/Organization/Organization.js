
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getListingsByOrganizationId,
  updateListing,
  deleteListing,
} from "../../Services/organizationService.js";
import styles from "./Organization.module.css";


export default function Organization() {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [listings, setListings] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({ event_name: "", price: "", qty: "", date:"", description: "" });

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const userId = parseJwt(token)?.sub;
        const orgData = await getOrganizationById(userId, token);
        setOrganization(orgData);

        const listingsData = await getListingsByOrganizationId(userId, token);
        setListings(listingsData);
      } catch (err) {
        console.error("Error fetching organization or listings:", err);
      }
    };

    fetchData();
  }, []);

  const handleDeleteListing = async (listingId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to delete a listing.");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
      if (!confirmDelete) return;

      setIsDeleting(true);
      await deleteListing(listingId, token);
      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
      alert("Listing deleted successfully!");
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (listing) => {
    setEditingListing(listing.id);
    setEditForm({
      event_name: listing.event_name,
      price: listing.price,
      qty: listing.qty,
      date: listing.date,
      description: listing.description,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateListing = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await updateListing(editingListing, editForm, token);
      alert("Listing updated successfully!");

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === editingListing ? { ...listing, ...editForm } : listing
        )
      );

      setEditingListing(null);
    } catch (err) {
      console.error("Error updating listing:", err);
      alert("Failed to update listing. Please try again.");
    }
  };

  const renderListing = (listing, canEdit = true) => (
  <li
    key={listing.id}
    className={styles.listingItem} 
  >
    {editingListing === listing.id && canEdit ? (
      
      <div className={styles.editFormContainer}>
        {/* Replaced: border rounded p-1 mb-1 w-full */}
        <input
          className={styles.editInput}
          name="event_name"
          value={editForm.event_name}
          onChange={handleEditChange}
        />
        <input
          className={styles.editInput}
          name="price"
          value={editForm.price}
          onChange={handleEditChange}
        />
        <input
          className={styles.editInput}
          name="qty"
          value={editForm.qty}
          onChange={handleEditChange}
        />
        <input
          type="date"
          className={styles.editInput}
          name="date"
          value={editForm.date}
          onChange={handleEditChange}
        />
        {/* Replaced: border rounded p-1 w-full */}
        <textarea
          className={styles.editTextArea}
          name="description"
          value={editForm.description}
          onChange={handleEditChange}
        />
        {/* Replaced: flex gap-2 mt-2 */}
        <div className={styles.editButtonContainer}>
          {/* Replaced: bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 */}
          <button
            className={styles.saveButton}
            onClick={handleUpdateListing}
          >
            Save
          </button>
          {/* Replaced: bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 */}
          <button
            className={styles.cancelButton}
            onClick={() => setEditingListing(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <>
        <div>
          {/* Replaced: font-bold text-lg */}
          <h3 className={styles.listingTitle}>{listing.event_name}</h3>
          {/* Replaced: text-gray-600 */}
          <p className={styles.listingDescription}>{listing.description}</p>
          {/* Replaced: text-gray-800 font-semibold mt-1 */}
          <p className={styles.listingDetails}>
            Price: ${listing.price} | Quantity: {listing.qty}
          </p>
        </div>

        {canEdit && (
          <div className={styles.actionButtons}> 
            {/* Replaced: bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 */}
            <button
              className={styles.editButton}
              onClick={() => handleEditClick(listing)}
            >
              Edit
            </button>
            {/* The delete button needs dynamic classes */}
            <button
              className={`${styles.deleteButton} ${
                isDeleting ? styles.deleteButtonDisabled : styles.deleteButtonEnabled
              }`}
              onClick={() => handleDeleteListing(listing.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </>
    )}
  </li>
);


  if (!organization) return <div>Loading...</div>;

  const pendingListings = listings.filter(listing => listing.state === "pending");
  const closedListings = listings.filter(listing => listing.state === "closed");

  return (
    // FIX: Removed comment before this div.
    <div className={styles.organizationContainer}>
      {/* Replaced: bg-white p-8 rounded-2xl shadow-md w-96 text-center mb-6 */}
      <div className={styles.welcomeCard}>
        {/* Replaced: text-2xl font-bold mb-4 */}
        <h1 className={styles.welcomeHeader}>
          Welcome, {organization.name}!
        </h1>
      </div>

      {/* Replaced: w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 */}
      <div className={styles.listingsGrid}>
        {/* Pending Listings Column - Replaced: bg-white p-6 rounded-2xl shadow-md */}
        <div className={styles.listingColumn}>
          {/* Replaced: text-xl font-semibold mb-4 text-blue-600 */}
          <h2 className={styles.pendingHeader}>
            Pending Listings ({pendingListings.length})
          </h2>

          {pendingListings.length === 0 ? (
            // FIX: Removed comment before this element
            <p className={styles.noListingText}>No pending listings.</p>
          ) : (
            // FIX: Removed comment before this element
            <ul className={styles.listingsList}>
              {pendingListings.map((listing) => renderListing(listing, true))}
            </ul>
          )}
        </div>

        {/* Closed Listings Column - Replaced: bg-white p-6 rounded-2xl shadow-md */}
        <div className={styles.listingColumn}>
          {/* Replaced: text-xl font-semibold mb-4 text-gray-600 */}
          <h2 className={styles.closedHeader}>
            Closed Listings ({closedListings.length})
          </h2>

          {closedListings.length === 0 ? (
            <p className={styles.noListingText}>No closed listings.</p>
          ) : (
            <ul className={styles.listingsList}>
              {closedListings.map((listing) => renderListing(listing, false))}
            </ul>
          )}
        </div>
      </div>

      {/* Replaced: mt-6 flex gap-4 */}
      <div className={styles.footerButtons}>
        {/* Refresh Button - Replaced: bg-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition */}
        <button
          className={styles.refreshButton}
          onClick={() => window.location.reload()}
        >
          Refresh Listings
        </button>

        {/* Create Listing Button - Replaced: bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition */}
        <button
          className={styles.createListingButton}
          onClick={() => navigate("/organization/add-listing")}
        >
          Create New Listing
        </button>

        {/* Log out Button - Replaced: bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition */}
        <button
          className={styles.logoutButton}
          onClick={() => navigate("/")}
        >
          Log out
        </button>
      </div>
    </div>
  );
}