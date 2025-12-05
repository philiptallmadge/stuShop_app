// import React, { useState, useEffect } from "react";
// import { getOrganizations, getListingsByOrganizationId } from "../../Services/organizationService.js";
// import { useNavigate, useParams } from "react-router-dom";
// import styles from "./SeeListings.module.css";
// import image from "./image2.webp"

// export default function SeeListings() {
//   const { orgId } = useParams();
//   const navigate = useNavigate();

//   const [org, setOrg] = useState(null);
//   const [listings, setListings] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) return;

//     // Load org info
//     getOrganizations(token).then((orgs) => {
//       const found = orgs.find((o) => String(o.id) === orgId);
//       setOrg(found);
//     });

//     // Load listings
//     getListingsByOrganizationId(orgId, token).then((data) => {
//       setListings(data);
//     });
//   }, [orgId]);

//   return (
//     <image src={image} alt="Background" className={styles.backgroundImage} />
//   <div className={styles.container}>
//     <div className={styles.contentWrapper}>
//       {org && (
//         <div className={styles.orgInfoCard}>
//           <h3>{org.name}</h3>
//           <p><strong>Email:</strong> {org.email}</p>
//         </div>
//       )}

//       <h4 className={styles.sectionHeader}>Listings</h4>

//       <div className={styles.listingsContainer}>
//         {listings.length === 0 ? (
//           <p className={styles.emptyState}>No listings found.</p>
//         ) : (
//           <ul className={styles.listingsList}>
//             {listings.map((listing) =>
//               listing.state === "pending" && (
//                 <li
//                   key={listing.id}
//                   className={styles.listingItem}
//                   onClick={() => {
//                     localStorage.setItem("selectedListing", JSON.stringify(listing));
//                     navigate(`/customer/listing/${listing.id}`);
//                   }}
//                 >
//                   <div className={styles.listingTitle}>
//                     {listing.event_name} <span className={styles.listingPrice}>— ${listing.price}</span>
//                   </div>
//                   <p className={styles.listingDescription}>{listing.description}</p>
//                 </li>
//               )
//             )}
//           </ul>
//         )}
//       </div>

//       <div className={styles.buttonContainer}>
//         <button
//           className={styles.backButton}
//           onClick={() => navigate("/customer")}
//         >
//           Go back to Dashboard
//         </button>
//       </div>
//     </div>
//   </div>
// );
// }

import React, { useState, useEffect } from "react";
import { getOrganizations, getListingsByOrganizationId } from "../../Services/organizationService.js";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./SeeListings.module.css";
import image from "./image2.webp";

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
    }).catch(err => console.error("Error loading org:", err));

    // Load listings
    getListingsByOrganizationId(orgId, token).then((data) => {
      setListings(data);
    }).catch(err => console.error("Error loading listings:", err));
  }, [orgId]);
  
  console.log("orgId:", orgId);
  console.log("org:", org);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* LEFT SECTION - Listings */}
        <div className={styles.leftSection}>
          
          <div className={styles.listingsContainer}>
            {listings.length === 0 ? (
              <p className={styles.emptyState}>No listings found.</p>
            ) : (
              <ul className={styles.listingsList}>
                {listings.map((listing) =>
                  listing.state === "pending" && (
                    <li
                      key={listing.id}
                      className={styles.listingItem}
                      onClick={() => {
                        localStorage.setItem("selectedListing", JSON.stringify(listing));
                        navigate(`/customer/listing/${listing.id}`);
                      }}
                    >
                      <div className={styles.listingTitle}>
                        {listing.event_name} <span className={styles.listingPrice}>— ${listing.price}</span>
                      </div>
                      <p className={styles.listingDescription}>{listing.description}</p>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT SECTION - Organization Info & Image */}
        <div className={styles.rightSection}>
          <div className={styles.buttonContainer}>
            <button
              className={styles.backButton}
              style={{ marginRight: "1rem" }}
              onClick={() => navigate("/customer/cart")}
            >
              My Cart 🛒
            </button>
            <button
              className={styles.backButton}
              onClick={() => navigate("/customer")}
            >
              Organizations
            </button>
          </div>
          {org && (
            <div className={styles.orgInfoCard}>
              <h3>{org.name}</h3>
              <p><strong>Email:</strong> {org.email}</p>
            </div>
          )}
          
          {/* Only render image if orgId exists */}
          {orgId && (
            <img 
              src={`http://129.74.153.235:5000/api/organizations/${orgId}/image`}
              alt={org ? org.name : "Organization"}
              style={{ 
                width: '200px', 
                height: '200px', 
                borderRadius: '1rem', 
                marginTop: '1rem',
                objectFit: 'cover'
              }}
              onError={(e) => {
                console.error("Image failed to load for orgId:", orgId);
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}