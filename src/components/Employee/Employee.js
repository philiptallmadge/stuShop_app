import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getEmployeeById} from "../../Services/employeeService.js"
import {getOrganizations, getOrganizationById, getListingsByOrganizationId, getOrdersByListing} from "../../Services/organizationService.js"
import styles from "./Employee.module.css"; 


export default function Employee() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [showOrgs, setShowOrgs] = useState(false);
    const [organization, setOrganization] = useState(null); // Full selected organization data
    const [showOrg, setShowOrg] = useState(false);
    const [listings, setListings] = useState([]);
    const [showListings, setShowListings] = useState(false);
    const [listing, setListing] = useState(null); // Full selected listing data
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    
    // NEW STATES for highlighting
    const [selectedOrgId, setSelectedOrgId] = useState(null);
    const [selectedListingId, setSelectedListingId] = useState(null); 

    const fetchOrdersByListing = async (lisId) => {
        try {
          const token = localStorage.getItem("authToken");
          const data = await getOrdersByListing(lisId,token);
          setOrders(data);
          setShowOrders(true);
      }
      catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchListingsByOrganization = async (orgId) => {
      try {
          const token = localStorage.getItem("authToken");
          const data = await getListingsByOrganizationId(orgId,token);
          setListings(data);
          setShowListings(true);
            setSelectedListingId(null); // Reset listing selection when changing organizations
      }
      catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    // Function to handle organization selection (replaces the select dropdown)
    const handleOrgSelect = async (orgId) => {
        setSelectedOrgId(orgId);
        try {
          const token = localStorage.getItem("authToken");
          const data = await getOrganizationById(orgId, token); 
          setOrganization(data);
          setShowOrg(true);
            setShowListings(false); // Hide listings when new org is selected
            setShowOrders(false); // Hide orders when new org is selected
        }
        catch (err) {
          console.error("Error fetching org:", err);
        }
      };
    
    // Function to handle listing selection (replaces the second select dropdown)
    const handleListingSelect = (listingId) => {
        setSelectedListingId(listingId);
        // Find the full listing object
        const selectedListing = listings.find(l => l.id === listingId);
        if (selectedListing) {
            setListing(selectedListing);
            fetchOrdersByListing(listingId);
        }
    };

    const fetchOrganizations = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const data = await getOrganizations(token);
          setOrganizations(data);
          setShowOrgs(true);
        }
        catch (err) {
          console.error("Error fetching organizations:", err);
        }
      };

    useEffect(() => {
        const fetchCurrentEmployee = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const userId = parseJwt(token).sub;
            const data = await getEmployeeById(userId, token);
            setEmployee(data);
        }
        catch (err) {
            console.error("Error fetching employee:", err);
        }
    };
    fetchCurrentEmployee();
    }, []);

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        }
        catch (e) {
            return null;
        }
    }

    if (!employee) return <div>Loading...</div>;
    return (
      <div className={styles.employeeContainer}> 
        <div className={styles.welcomeCard}>
            <h1 className={styles.welcomeHeader}>
              Welcome, {employee.first_name} {employee.last_name}!
            </h1>
            <p className={styles.employeeEmail}>Email: {employee.email}</p>
            
            <button 
              className={styles.logoutButton}
              onClick={() => navigate("/")}
            >
              Log out
            </button>

            <button className={styles.primaryButton} onClick={fetchOrganizations}>
              Show All Organizations
            </button>
        </div>

        <div className={styles.contentLayout}>
          
          {/* Organizations List */}
          {showOrgs && (
            <div className={styles.sectionCard}>
              <h2>Select Organization</h2>
              
              <ul className={styles.orgList}>
                {organizations.map((org) => (
                  <li 
                    key={org.id} 
                      // Apply hover/active style
                    className={`${styles.orgListItem} ${selectedOrgId === org.id ? styles.activeItem : ''}`}
                    onClick={() => handleOrgSelect(org.id)}
                  >
                    <strong>ID: {org.id}</strong> | {org.name}
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        {/* Organization Details and Listings */}
        {showOrg && organization && (
          <div className={styles.sectionCardLarge}>
            <h2>{organization.name} Details</h2>
            <p>Email: <strong>{organization.email}</strong></p>
            <p>Phone: <strong>{organization.phone_number}</strong></p>
            <p className={styles.orgDescription}>{organization.description}</p>
          
            <button 
              className={styles.primaryButton} 
              onClick={() => fetchListingsByOrganization(organization.id)}>
              Show {organization.name} Listings
            </button>

            {/* Listings and Order Selector */}
            {showListings && (
              <div className={styles.nestedSection}>
                <h3>Available Listings ({listings.length})</h3>
                
                <ul className={styles.listingsList}>
                  {listings.map((lis) => (
                    <li 
                      key={lis.id} 
                        // Apply hover/active style
                      className={`${styles.listingItem} ${selectedListingId === lis.id ? styles.activeItem : ''}`}
                      onClick={() => handleListingSelect(lis.id)}
                    >
                      ID: {lis.id} | <strong>{lis.event_name}</strong> | Price: ${lis.price}
                    </li>
                  ))}
                </ul>

                {/* Removed the select and Show Orders button, now handled by clicking the list item */}
              </div>
            )
            }

            {/* Orders Display */}
            {showOrders && (
              <div className={styles.nestedSection}>
                <h3>Orders for Listing ID: {selectedListingId} ({orders.length})</h3>
                <ul className={styles.ordersList}>
                  {orders.map((ord) => (
                    <li key={ord.id} className={styles.orderItem}>
                      <strong>ID: {ord.id}</strong> | {ord.first_name} {ord.last_name} | Paid: {ord.paid ? 'Yes' : 'No'}
                    </li>
                  )) }
                </ul>
              </div>
            )
            }
          </div>
        )
        }
        </div>
      </div>
  );
}