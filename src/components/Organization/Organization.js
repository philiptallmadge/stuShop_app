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

  const handleSeeOrders = (listingId) => {
    // Navigate to orders page and pass the listing ID
    navigate(`/organization/orders/${listingId}`);
  };

  const renderListing = (listing, canEdit = true) => (
  <li
    key={listing.id}
    className={styles.listingItem} 
  >
    {editingListing === listing.id && canEdit ? (
      
      <div className={styles.editFormContainer}>
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
        <textarea
          className={styles.editTextArea}
          name="description"
          value={editForm.description}
          onChange={handleEditChange}
        />
        <div className={styles.editButtonContainer}>
          <button
            className={styles.saveButton}
            onClick={handleUpdateListing}
          >
            Save
          </button>
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
          <h3 className={styles.listingTitle}>{listing.event_name}</h3>
          <p className={styles.listingDescription}>{listing.description}</p>
          <p className={styles.listingDetails}>
            Price: ${listing.price} | Quantity: {listing.qty}
          </p>
        </div>

        {canEdit && (
          <div className={styles.actionButtons}> 
            <button
              className={styles.seeOrdersButton}
              onClick={() => handleSeeOrders(listing.id)}
            >
              See Orders
            </button>
            <button
              className={styles.editButton}
              onClick={() => handleEditClick(listing)}
            >
              Edit
            </button>
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
    <div className={styles.organizationContainer}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeHeader}>
          Welcome, {organization.name}!
        </h1>
         <div className={styles.buttonContainer}>
            <button 
              className={styles.logoutButton}
              onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/");
            }}
            >
              Log out
            </button>
            </div>
      </div>
      
      <div className={styles.listingsGrid}>
        <div className={styles.listingColumn}>
          <h2 className={styles.pendingHeader}>
            Pending Listings ({pendingListings.length})
          </h2>

          {pendingListings.length === 0 ? (
            <p className={styles.noListingText}>No pending listings.</p>
          ) : (
            <ul className={styles.listingsList}>
              {pendingListings.map((listing) => renderListing(listing, true))}
            </ul>
          )}
        </div>

        <div className={styles.listingColumn}>
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

      <div className={styles.footerButtons}>
        <button
          className={styles.refreshButton}
          onClick={() => window.location.reload()}
        >
          Refresh Listings
        </button>

        <button
          className={styles.createListingButton}
          onClick={() => navigate("/organization/add-listing")}
        >
          Create New Listing
        </button>

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