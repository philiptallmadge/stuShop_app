
// import React, { useState, useEffect } from "react";
// import { getCustomerById } from "../../Services/customerService.js";
// import { getOrganizations, getListingsByOrganizationId } from "../../Services/organizationService.js";
// import { useNavigate } from "react-router-dom";

// export default function Customer() {
//   const navigate = useNavigate();
//   const [customer, setCustomer] = useState(null);
//   const [organizations, setOrganizations] = useState([]);
//   const [selectedOrg, setSelectedOrg] = useState(null);
//   const [orgListings, setOrgListings] = useState([]);

//   function parseJwt(token) {
//     try {
//       return JSON.parse(atob(token.split(".")[1]));
//     } catch (e) {
//       return null;
//     }
//   }

//   // Fetch customer & organizations on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) return;

//         const userId = parseJwt(token)?.sub;

//         const userData = await getCustomerById(userId, token);
//         setCustomer(userData);

//         const orgs = await getOrganizations(token);
//         setOrganizations(orgs);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch listings every time selectedOrg changes
//   useEffect(() => {
//     if (!selectedOrg) return;

//     const token = localStorage.getItem("authToken");
//     if (!token) return;

//     getListingsByOrganizationId(selectedOrg.id, token)
//       .then((data) => setOrgListings(data))
//       .catch((err) => console.error("Error loading org listings:", err));
//   }, [selectedOrg]);
//     console.log(orgListings);

//   return (
//     <div>
//       <h1>Customer Dashboard</h1>

//       {customer ? (
//         <div>
//           <p>Hey {customer.first_name}</p>
//           <p>Email: {customer.email}</p>
//         </div>
//       ) : (
//         <p>Loading customer data...</p>
//       )}

//       <h2>Your Organizations</h2>
//       {organizations.length > 0 ? (
//         <div>
//           {organizations.map((org) => (
//             <button
//               key={org.id}
//               style={{ display: "block", marginBottom: "10px" }}
//               onClick={() => setSelectedOrg(org)}
//             >
//               {org.name}
//             </button>
//           ))}
//         </div>
//       ) : (
//         <p>No organizations found.</p>
//       )}

//       {selectedOrg && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "10px",
//             border: "1px solid #ccc",
//           }}
//         >
//           <h3>Organization Details</h3>
//           <p>
//             <strong>Name:</strong> {selectedOrg.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {selectedOrg.email}
//           </p>

//           <h4>Listings</h4>
//           {orgListings.length === 0 ? (
//             <p>No listings found.</p>
//           ) : (
//             <ul>
//             {orgListings.map((listing) =>
//                 listing.state === "pending" && (  // only render if pending
//                 <li key={listing.id}>
//                     <strong>{listing.event_name}</strong> — ${listing.price}
//                     <p>{listing.description}</p>
//                 </li>
//                 )
//             )}
//             </ul>
//           )}
//         </div>
//       )}

//       <button
//         className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
//         onClick={() => navigate("/")}
//       >
//         Log out
//       </button>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { getCustomerById } from "../../Services/customerService.js";
import { getOrganizations, getListingsByOrganizationId } from "../../Services/organizationService.js";
import { useNavigate } from "react-router-dom";
import styles from "./Customer.module.css"; 

export default function Customer() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgListings, setOrgListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null); 

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
        const userData = await getCustomerById(userId, token);
        setCustomer(userData);
        const orgs = await getOrganizations(token);
        setOrganizations(orgs);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedOrg) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;
    getListingsByOrganizationId(selectedOrg.id, token)
      .then((data) => setOrgListings(data))
      .catch((err) => console.error("Error loading org listings:", err));
    setSelectedListing(null);
  }, [selectedOrg]);

  return (
    <div className={styles.customerContainer}>
      <h1>Customer Dashboard</h1>
      {customer ? (
        <div>
          <p>Hey {customer.first_name}</p>
          <p>Email: {customer.email}</p>
        </div>
      ) : (
        <p>Loading customer data...</p>
      )}

      <div className={styles.contentLayout}>
        <div className={styles.organizationsSection}>
          <h2>Your Organizations</h2>
          {organizations.length > 0 ? (
            <div className={styles.organizationsList}>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  className={`${styles.orgButton} ${selectedOrg?.id === org.id ? styles.active : ''}`}
                  onClick={() => setSelectedOrg(org)}
                >
                  {org.name}
                </button>
              ))}
            </div>
          ) : (
            <p>No organizations found.</p>
          )}
        </div>

        {selectedOrg && (
          <div className={styles.detailsSection}>
            <h3>Organization Details</h3>
            <p><strong>Name:</strong> {selectedOrg.name}</p>
            <p><strong>Email:</strong> {selectedOrg.email}</p>

            <h4>Listings</h4>
            {orgListings.length === 0 ? (
              <p>No listings found.</p>
            ) : (
                // Add a class to the ul for styling
              <ul className={styles.listingsList}> 
                {orgListings.map(
                  (listing) =>
                    listing.state === "pending" && (
                      <li
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className={styles.listingItem}
                      >
                        {/* Wrap title and price in a span with a class */}
                        <span className={styles.listingTitle}>
                          <strong>{listing.event_name}</strong> — ${listing.price}
                        </span>
                        {/* Add a class to the description paragraph */}
                        <p className={styles.listingDescription}>{listing.description}</p>
                      </li>
                    )
                )}
              </ul>
            )}

            {selectedListing && (
              <div className={styles.listingDetailsBox}>
                <h5>Listing Details</h5>
                <p><strong>Name:</strong> {selectedListing.event_name}</p>
                <p><strong>Price:</strong> ${selectedListing.price}</p>
                <p><strong>Description:</strong> {selectedListing.description}</p>
                <p><strong>Status:</strong> {selectedListing.state}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className={styles.logoutButton}
        onClick={() => navigate("/")}
      >
        Log out
      </button>
    </div>
  );
}