import React, { useState, useEffect } from "react";
import { getCustomerById } from "../../Services/customerService.js";
import { getOrganizations, getListingsByOrganizationId } from "../../Services/organizationService.js";
import { useNavigate } from "react-router-dom";
import styles from "./Customer.module.css"; 
// import image from "./image2.webp";

export default function Customer() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgListings, setOrgListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null); 

  function parseJwt(token) {
    try { return JSON.parse(atob(token.split(".")[1])); }
    catch { return null; }
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
      <h2 style={{ marginTop: "6rem", fontSize: "3rem" }}>Notre Dame's Student Organizations</h2>
      
      <div className={styles.logoutRow}>
        <button
          className={styles.logoutButton}
          onClick={() => navigate("/customer/cart")}
        >
          My Cart 🛒
        </button>
        <button
          className={styles.logoutButton}
          onClick={() => navigate("/")}
        >
          Log out
        </button>
        <button
          className={styles.logoutButton}
          onClick={() => navigate("/customer/all-listings")}
        >
          See All Listings
        </button>
      </div>

      {organizations.length > 0 ? (
        <div className={styles.organizationTabs}>
          {organizations.map((org) => (
            <button
              key={org.id}
              className={styles.orgCard}
              onClick={() => navigate(`/customer/org/${org.id}`)}
            >
              {/* <img src={image} alt={org.name} className={styles.orgCardImage} /> */}
              <img 
                src={`http://129.74.153.235:5000/api/organizations/${org.id}/image`}
                alt={org.name}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  marginBottom: '0.5rem',
                  objectFit: 'cover'
                }}
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className={styles.orgCardName}>{org.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p>No organizations found.</p>
      )}
    </div>
  );
}
