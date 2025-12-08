import React, { useState, useEffect } from "react";
import { getCustomerById, getAllListings } from "../../Services/customerService.js";
import { useNavigate } from "react-router-dom";
import styles from "./SeeAllListings.module.css"; 

export default function CustomerAllListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  // NEW STATE: For the search input
  const [searchTerm, setSearchTerm] = useState('');

  function parseJwt(token) {
    try { return JSON.parse(atob(token.split(".")[1])); }
    catch { return null; }
  }

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        // Fetch all listings from all organizations
        const allListings = await getAllListings(token);
        // Filter only pending listings
        const pendingListings = allListings.filter(listing => listing.state === "pending");
        setListings(pendingListings);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [navigate]);


  // NEW LOGIC: Filter listings based on the search term
  const filteredListings = listings.filter(listing => {
      if (!searchTerm) return true; // Show all if search term is empty

      const lowerSearchTerm = searchTerm.toLowerCase();

      // Check listing title (event_name)
      const titleMatch = (listing.event_name ?? '').toLowerCase().includes(lowerSearchTerm);

      // Check description
      const descriptionMatch = (listing.description ?? '').toLowerCase().includes(lowerSearchTerm);

      // Check price (convert to string for searching, accounting for $ and cents)
      const priceString = (listing.price ?? '').toString();
      const priceMatch = priceString.includes(lowerSearchTerm);

      return titleMatch || descriptionMatch || priceMatch;
  });


  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingMessage}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.pageTitle}>All Available Listings</h2>
        
        <div className={styles.topButtonContainer}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/customer")}
          >
            Dashboard
          </button>
          <button
            className={styles.cartButton}
            onClick={() => navigate("/customer/cart")}
          >
            My Cart 🛒
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search by Title, Description, or Price..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {filteredListings.length > 0 ? (
          <div className={styles.listingsGrid}>
            {/* Map over the FILTERED list */}
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className={styles.listingCard}
                onClick={() => {
                  localStorage.setItem("selectedListing", JSON.stringify(listing));
                  navigate(`/customer/listing/${listing.id}`);
                }}
              >
                <h3 className={styles.listingTitle}>{listing.event_name}</h3>
                <p className={styles.listingPrice}>${listing.price}</p>
                <p className={styles.listingDescription}>
                  {listing.description}
                </p>
                <div className={styles.listingFooter}>
                  <span className={styles.listingStatus}>
                    Status: <strong>{listing.state}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No listings available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}