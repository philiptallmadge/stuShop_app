import React, { useState, useEffect } from "react";
import { getOrganizations, getListingsByOrganizationId } from "../../Services/organizationService.js";
import { useNavigate, useParams } from "react-router-dom";

export default function SeeListings() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [org, setOrg] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Load org info
    getOrganizations(token).then((orgs) => {
      const found = orgs.find((o) => String(o.id) === orgId);
      setOrg(found);
    });

    // Load listings
    getListingsByOrganizationId(orgId, token).then((data) => {
      setListings(data);
    });
  }, [orgId]);

  return (
    <div>
      {org && (
        <div>
          <h3>{org.name}</h3>
          <p><strong>Email:</strong> {org.email}</p>
        </div>
      )}

      <h4>Listings</h4>

      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <ul>
          {listings.map((listing) =>
            listing.state === "pending" && (
              <li
                key={listing.id}
                onClick={() => {
                  // Store clicked listing for next page
                  localStorage.setItem("selectedListing", JSON.stringify(listing));
                  navigate(`/customer/listing/${listing.id}`);
                }}
                style={{
                  cursor: "pointer",
                  marginBottom: "15px",
                  padding: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <strong>{listing.event_name}</strong> — ${listing.price}
                <p>{listing.description}</p>
              </li>
            )
          )}
        </ul>
      )}
      <button
        className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition mt-4"
        onClick={() => navigate("/customer")}
      >
        Go back to Dashboard
      </button>
    </div>
  );
}