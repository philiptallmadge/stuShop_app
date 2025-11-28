import React, { useState, useEffect } from "react";
import { getCustomerById } from "../../Services/customerService.js";
import { getOrganizations, getListingsByOrganizationId } from "../../Services/organizationService.js";
// import { getOrganizations } from "../../Services/organizationService.js";
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
      
      <h2>School Wide Organizations</h2>

      {organizations.length > 0 ? (
        <div>
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => navigate(`/customer/org/${org.id}`)}
              style={{ display: "block", marginBottom: "10px" }}
            >
              {org.name}
            </button>
          ))}
        </div>
      ) : (
        <p>No organizations found.</p>
      )}

      <button
        className={styles.logoutButton}
        onClick={() => navigate("/customer/cart")}
      >
        Shopping Cart
      </button>

      <button
        className={styles.logoutButton}
        onClick={() => navigate("/")}
      >
        Log out
      </button>
    </div>
  );
}


