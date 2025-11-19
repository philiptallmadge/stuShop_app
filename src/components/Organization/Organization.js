
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
    className="p-4 border rounded-xl shadow-sm text-left"
  >
    {editingListing === listing.id && canEdit ? (
      <div className="flex-1">
        <input
          className="border rounded p-1 mb-1 w-full"
          name="event_name"
          value={editForm.event_name}
          onChange={handleEditChange}
        />
        <input
          className="border rounded p-1 mb-1 w-full"
          name="price"
          value={editForm.price}
          onChange={handleEditChange}
        />
        <input
          className="border rounded p-1 mb-1 w-full"
          name="qty"
          value={editForm.qty}
          onChange={handleEditChange}
        />
        <input
          type="date"
          className="border rounded p-1 mb-1 w-full"
          name="date"
          value={editForm.date}
          onChange={handleEditChange}
        />
        <textarea
          className="border rounded p-1 w-full"
          name="description"
          value={editForm.description}
          onChange={handleEditChange}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            onClick={handleUpdateListing}
          >
            Save
          </button>
          <button
            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            onClick={() => setEditingListing(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <>
        <div>
          <h3 className="font-bold text-lg">{listing.event_name}</h3>
          <p className="text-gray-600">{listing.description}</p>
          <p className="text-gray-800 font-semibold mt-1">
            Price: ${listing.price} | Quantity: {listing.qty}
          </p>
        </div>

        {canEdit && (
          <div className="flex gap-2 mt-3">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => handleEditClick(listing)}
            >
              Edit
            </button>
            <button
              className={`${
                isDeleting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-3 py-1 rounded transition`}
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center mb-6">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {organization.name}!
        </h1>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pending Listings Column */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Pending Listings ({pendingListings.length})
          </h2>

          {pendingListings.length === 0 ? (
            <p className="text-gray-500">No pending listings.</p>
          ) : (
            <ul className="space-y-3">
              {/* {pendingListings.map(renderListing, true)} */}
              {pendingListings.map((listing) => renderListing(listing, true))}
            </ul>
          )}
        </div>

        {/* Closed Listings Column */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">
            Closed Listings ({closedListings.length})
          </h2>

          {closedListings.length === 0 ? (
            <p className="text-gray-500">No closed listings.</p>
          ) : (
            <ul className="space-y-3">
              {closedListings.map((listing) => renderListing(listing, false))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="bg-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition"
          onClick={() => window.location.reload()}
        >
          Refresh Listings
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
          onClick={() => navigate("/organization/add-listing")}
        >
          Create New Listing
        </button>

        <button
          className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
          onClick={() => navigate("/")}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
