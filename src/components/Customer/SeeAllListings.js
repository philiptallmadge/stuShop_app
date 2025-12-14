// import React, { useState, useEffect } from "react";
// import { getCustomerById, getAllListings } from "../../Services/customerService.js";
// import { useNavigate } from "react-router-dom";
// import styles from "./SeeAllListings.module.css"; 

// export default function CustomerAllListings() {
//   const navigate = useNavigate();
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // NEW STATE: For the search input
//   const [searchTerm, setSearchTerm] = useState('');

//   function parseJwt(token) {
//     try { return JSON.parse(atob(token.split(".")[1])); }
//     catch { return null; }
//   }

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           navigate("/");
//           return;
//         }

//         // Fetch all listings from all organizations
//         const allListings = await getAllListings(token);
//         // Filter only pending listings
//         const pendingListings = allListings.filter(listing => listing.state === "pending");
//         setListings(pendingListings);
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching listings:", err);
//         setLoading(false);
//       }
//     };
    
//     fetchListings();
//   }, [navigate]);


//   // NEW LOGIC: Filter listings based on the search term
//   const filteredListings = listings.filter(listing => {
//       if (!searchTerm) return true; // Show all if search term is empty

//       const lowerSearchTerm = searchTerm.toLowerCase();

//       // Check listing title (event_name)
//       const titleMatch = (listing.event_name ?? '').toLowerCase().includes(lowerSearchTerm);

//       // Check description
//       const descriptionMatch = (listing.description ?? '').toLowerCase().includes(lowerSearchTerm);

//       // Check price (convert to string for searching, accounting for $ and cents)
//       const priceString = (listing.price ?? '').toString();
//       const priceMatch = priceString.includes(lowerSearchTerm);

//       return titleMatch || descriptionMatch || priceMatch;
//   });


//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <p className={styles.loadingMessage}>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.contentWrapper}>
//         <h2 className={styles.pageTitle}>All Available Listings</h2>
        
//         <div className={styles.topButtonContainer}>
//           <button
//             className={styles.backButton}
//             onClick={() => navigate("/customer")}
//           >
//             Dashboard
//           </button>
//           <button
//             className={styles.cartButton}
//             onClick={() => navigate("/customer/cart")}
//           >
//             My Cart 🛒
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className={styles.searchContainer}>
//             <input
//                 type="text"
//                 placeholder="Search by Title, Description, or Price..."
//                 className={styles.searchInput}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//         </div>

//         {filteredListings.length > 0 ? (
//           <div className={styles.listingsGrid}>
//             {/* Map over the FILTERED list */}
//             {filteredListings.map((listing) => (
//               <div
//                 key={listing.id}
//                 className={styles.listingCard}
//                 onClick={() => {
//                   localStorage.setItem("selectedListing", JSON.stringify(listing));
//                   navigate(`/customer/listing/${listing.id}`);
//                 }}
//               >
//                 <h3 className={styles.listingTitle}>{listing.event_name}</h3>
//                 <p className={styles.listingPrice}>${listing.price}</p>
//                 <p className={styles.listingDescription}>
//                   {listing.description}
//                 </p>
//                 <div className={styles.listingFooter}>
//                   <span className={styles.listingStatus}>
//                     Status: <strong>{listing.state}</strong>
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className={styles.emptyState}>
//             <p>No listings available at this time.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { getAllListings } from "../../Services/customerService.js";
import { useNavigate } from "react-router-dom";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import styles from "./SeeAllListings.module.css"; 

export default function CustomerAllListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchClient, setSearchClient] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize Algolia - runs once when component loads
  useEffect(() => {
    // Replace these with your actual Algolia credentials
    const APP_ID = '3FWY1AXMND';
    const SEARCH_API_KEY = 'c26f9600826e02d2ee418ddbe395be69';  // Use Search-Only API Key from Algolia dashboard
    
    const client = algoliasearch(APP_ID, SEARCH_API_KEY);
    setSearchClient(client);
  }, []);

  // Fetch initial listings when page loads
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        const allListings = await getAllListings(token);
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

  // Search with Algolia whenever user types
  useEffect(() => {
    // Only search if we have a search term
    if (!searchClient || !searchTerm.trim()) {
      return;
    }

    // Debounce: wait 300ms after user stops typing before searching
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchClient.search({
          requests: [
            {
              indexName: 'listings',
              query: searchTerm,
            },
          ],
        });
        
        setListings(results.results[0].hits);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    // Cleanup function to cancel previous timeout
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchClient]);

  // Handle when user types in search box
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If search box is cleared, reload all listings from database
    if (!value.trim()) {
      try {
        const token = localStorage.getItem("authToken");
        const allListings = await getAllListings(token);
        const pendingListings = allListings.filter(listing => listing.state === "pending");
        setListings(pendingListings);
      } catch (err) {
        console.error("Error reloading listings:", err);
      }
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Make sure this URL matches your Flask backend port (usually 5000)
      const response = await fetch("http://localhost:5000/sync-algolia", {
        method: "GET", // Matches the route we set up in app.py
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("Success: " + data.message);
      } else {
        alert("Sync Failed: " + data.error);
      }
    } catch (error) {
      console.error("Sync error:", error);
      alert("Error connecting to backend.");
    } finally {
      setIsSyncing(false);
    }
  };

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

          <button
            className={styles.cartButton} // Re-using cart style for consistency
            onClick={handleSync}
            disabled={isSyncing} // Disable button while it's running
            style={{ 
              backgroundColor: isSyncing ? '#6c757d' : '#28a745', // Grey if loading, Green if ready
              marginLeft: '10px' 
            }} 
          >
            {isSyncing ? "Syncing..." : "Sync Search"}
          </button>
          
        </div>

        {/* Algolia Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by Title, Description, or Price..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {listings.length > 0 ? (
          <div className={styles.listingsGrid}>
            {listings.map((listing) => (
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
            <p>No listings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}