import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getEmployeeById} from "../../Services/employeeService.js"
import {getOrganizations, getOrganizationById, getListingsByOrganizationId, getOrdersByListing} from "../../Services/organizationService.js"
import styles from "./Employee.module.css"

export default function Employee() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [showOrgs, setShowOrgs] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [showOrg, setShowOrg] = useState(false);
    const [listings, setListings] = useState([]);
    const [showListings, setShowListings] = useState(false);
    const [listing, setListing] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    
    /*
    const fetchOrdersByOrganization = async (orgId) => {
      try {
          const token = localStorage.getItem("authToken");
          console.log(orgId);
          const data = await getOrdersByOrganizationId(orgId,token);
          setListings(data);
          setShowListings(true);
      }
      catch (err) {
        console.error("Error fetching organizations:", err);
      }
    };*/
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
      }
      catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    const fetchOrganizationById = async (org) => {
        if (!org) {
          console.warn("No organization selected");
          return
        }
        try {
          const token = localStorage.getItem("authToken");
          const data = await getOrganizationById(org,token);
          setOrganization(data);
          setShowOrg(true);
        }
        catch (err) {
          console.error("Error fetching org:", err);
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
      <>
        <div>
          <div>
            <h1>
              Welcome, {employee.first_name} {employee.last_name}!
            </h1>
            <p>Email: {employee.email}</p>
            <button style = {{display: "block"}}
          onClick={() => navigate("/")}
            >
              Log out
            </button>
            <button onClick={fetchOrganizations}>
              Show Organizations
            </button>
            {showOrgs && (
              <>
              <ul>
              {organizations.map((org) => (
                <li key={org.id}>{org.id} | {org.name}</li>
              ))}
            </ul>
          <div>
            <select onChange={(e) => setOrganization(e.target.value)}>
              <option value="">Select Organization ID</option>
              {organizations?.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <button onClick={() => fetchOrganizationById(organization)}>Show Organization</button>
          </div>
          </>
          )
        }
        {showOrg && (
          <>
          <div>
            <h2>{organization.name}</h2>
            <p>Email: {organization.email}</p>
            <p>Phone: {organization.phone_number}</p>
            <p>{organization.description}</p>
          </div>
          </>
        )}
        {showOrg && (<button onClick={() => fetchListingsByOrganization(organization.id)}>Show {organization.name} Listings</button>
          )
        }
        {showOrg && showListings && (
          <>
           <ul>
              {listings.map((lis) => (
                <li key={lis.id}>{lis.id} | {lis.event_name} | {lis.price}</li>
              ))}
            </ul>
        <select onChange={(e) => setListing(e.target.value)}>
            <option value="">Select Listing For Data</option>
            {listings?.map((l) => (
              <option key={l.id} value={l.id}>{l.event_name}</option>
            ))}
        </select>
        <button onClick={() => fetchOrdersByListing(listing)}>Show Orders for Listing</button>
        </>
        )
        }
        {showOrg && showListings && showOrders && (
          <ul>
            {orders.map((ord) => (
              <li key={ord.id}>{ord.id} | {ord.first_name} | {ord.last_name} | {ord.event_name} | {ord.paid}</li>
            )) }
          </ul>
        )
        }
          </div>
        </div>
      </>
  );
 
}