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
    

    const [selectedOrgId, setSelectedOrgId] = useState(null);
    const [selectedListingId, setSelectedListingId] = useState(null); 
    // new state for seaarch input
    const [orderSearchTerm, setOrderSearchTerm] = useState('');

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
          // NEW: Automatically fetch and show listings when org is selected
          fetchListingsByOrganization(orgId);
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
        // Reset search field when selecting a new listing
        setOrderSearchTerm('');
    };

    const fetchOrganizations = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const data = await getOrganizations(token);
          setOrganizations(data);

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
            
            // NEW: Fetch all organizations and SHOW them automatically on load
            const orgsData = await getOrganizations(token);
            setOrganizations(orgsData);
            setShowOrgs(true); // Always show organizations on load
        }
        catch (err) {
            console.error("Error fetching employee or organizations:", err);
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

    // Filtering logic applied to the orders array
    const filteredOrders = orders?.filter(order => {
        //If the search term is empty, show all orders.
        if (!orderSearchTerm) {
            return true; 
        }
        
        const searchTermLower = orderSearchTerm.toLowerCase();
        
        // Safely get names and create a robust FULL NAME string.
        const firstName = (order.first_name ?? '').toLowerCase();
        const lastName = (order.last_name ?? '').toLowerCase();
        
        // Create a search target that includes the necessary space for searching full names.
        // This is the string we will check against.
        const searchTarget = `${firstName} ${lastName}`; 
        
        // Check if the search term is included in the full name string.
        return searchTarget.includes(searchTermLower);
    });

    if (!employee) return <div>Loading...</div>;
    return (
      <div className={styles.container}> 
            {/* EMPLOYEE WELCOME CARD */}
            <div className={styles.welcomeCard}>
                <h1 className={styles.welcomeHeader}>
                  Welcome, {employee.first_name} {employee.last_name}!
                </h1>
                <p className={styles.employeeEmail}>Email: {employee.email}</p>
                
                <div className={styles.buttonContainer}>
                    {/* REMOVED: Show All Organizations Button */}
                    <button 
                      className={styles.logoutButton}
                      onClick={() => navigate("/")}
                    >
                      Log out
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className={styles.contentWrapper}>
                
                {/* LEFT SECTION: Organizations List and Listings */}
                <div className={styles.leftSection}>
                    
                    {/* ORGANIZATIONS LIST (Always shown now) */}
                    {showOrgs && (
                        <div className={styles.listingsContainer}>
                            <h2 className={styles.sectionHeader}>Select Organization</h2>
                            
                            <ul className={`${styles.orgList} ${styles.scrollableList}`}>
                                {organizations.length === 0 ? (
                                    <p className={styles.emptyState}>No organizations found.</p>
                                ) : (
                                    organizations.map((org) => (
                                        <li 
                                          key={org.id} 
                                          className={`${styles.listingItem} ${selectedOrgId === org.id ? styles.activeItem : ''}`}
                                          onClick={() => handleOrgSelect(org.id)}
                                        >
                                          <strong>ID: {org.id}</strong> | {org.name}
                                        </li>
                                        ))
                                )}
                            </ul>
                        </div>
                    )
                    }

                    {/* LISTINGS DISPLAY (if organization is selected) */}
                    {showOrg && organization && (
                        <div className={styles.listingsContainer}>
                            
                            {/* NEW: Container for the Header and Button */}
                            <div className={styles.sectionHeaderGroup}>
                                <h2 className={styles.sectionHeader}>
                                    {organization.name} Listings
                                </h2>
                                <div className={styles.headerActions}>
                                    {/* Refresh Listings Button */}
                                    <button 
                                        className={styles.secondaryButtonSmall} 
                                        onClick={() => fetchListingsByOrganization(organization.id)}>
                                        Refresh Listings
                                    </button>
                                </div>
                            </div>
                            
                            {showListings && listings.length > 0 ? (
                                <ul className={`${styles.listingsList} ${styles.scrollableList}`}>
                                    {listings.map((lis) => (
                                        <li 
                                            key={lis.id} 
                                            className={`${styles.listingItem} ${selectedListingId === lis.id ? styles.activeItem : ''}`}
                                            onClick={() => handleListingSelect(lis.id)}
                                        >
                                            <div className={styles.listingTitle}>ID: {lis.id} | <strong>{lis.event_name}</strong></div>
                                            <div className={styles.listingPrice}>Price: ${lis.price}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.emptyState}>No listings found for this organization.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SECTION: Organization Details and Orders */}
                <div className={styles.rightSection}>
                    
                    {/* ORGANIZATION DETAILS CARD */}
                    {showOrg && organization ? (
                        <div className={styles.orgInfoCard}>
                            <h3>Organization Details</h3>
                            <p>Name: <strong>{organization.name}</strong></p>
                            <p>Email: <strong>{organization.email}</strong></p>
                            <p>Phone: <strong>{organization.phone_number}</strong></p>
                            <p className={styles.orgDescription}>{organization.description || "No description provided."}</p>
                        </div>
                    ) : (
                        <div className={styles.orgInfoCard}>
                            <p className={styles.emptyState}>Select an Organization from the left to view details.</p>
                        </div>
                    )}

                    {/* ORDERS DISPLAY */}
                    {showOrders && selectedListingId && (
                        <div className={styles.orgInfoCard}>
                            <h3>Orders for Listing ID: {selectedListingId} ({orders.length})</h3>

                            {/* NEW: Search Input Field */}
                            <div className={styles.searchContainer}>
                                <input
                                    type="text"
                                    placeholder="Search order by name..."
                                    className={styles.searchInput}
                                    value={orderSearchTerm}
                                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                                />
                            </div>

                            <ul className={`${styles.ordersList} ${styles.scrollableList}`}>
                                {orders.length === 0 ? (
                                    <p className={styles.emptyState}>No orders found for this listing.</p>
                                ) : (
                                    filteredOrders?.map((ord) => (
                                        <li key={ord.id} className={styles.orderItem}>
                                            <p><strong>Order ID: {ord.id}</strong></p>
                                            <p>{ord.first_name} {ord.last_name}</p>
                                            <p className={styles.orderPaid}>Paid: <strong>{ord.paid ? 'YES' : 'NO'}</strong></p>
                                        </li>
                                        ))
                                )}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
  );
}