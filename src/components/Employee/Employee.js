import { useState, useEffect } from "react";

import {getEmployeeById} from "../../Services/employeeService.js"
import {getOrganizations, getOrganizationById} from "../../Services/organizationService.js"
export default function Employee() {
    const [employee, setEmployee] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [showOrgs, setShowOrgs] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [showOrg, setShowOrg] = useState(false);
    try {
      const token = localStorage.getItem("authToken");
      const userId = parseJwt(token).sub;
    }
    catch (err) {
      console.error("Error fetching employee:", err);
    }
    const fetchOrganizationById = async (orgId) => {
        try {
          const token = localStorage.getItem("authToken");
          const data = await getOrganizationById(orgId,token);
          setOrganization(data);
          setShowOrg(true);
        }
        catch (err) {
          console.error("Error fetching organizations:", err);
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
            <h1 className="text-2xl font-bold mb-4">
              Welcome, {employee.first_name} {employee.last_name}!
            </h1>
            <p>Email: {employee.email}</p>
            <button onClick={fetchOrganizations}>
              Show Organizations
            </button>
            {showOrgs && (
              <ul>
              {organizations.map((org) => (
                <li key={org.id}>{org.id}{org.name} | {org.email}</li>
              ))}
            </ul>
            )}
          <div>
          <select onChange={(e) => setOrganization(e.target.value)}>
            <option value="">Select Organization ID</option>
            {organizations?.map((org) => (
              <option key={org.id} value={org.id}>{org.id}</option>
            ))}
          </select>
          <button onClick={() => fetchOrganizationById(organization)}>Show Organization</button>
        </div>
          
        {showOrg && (
          <div className="mt-2 p-2 border rounded">
            <h2>{organization.name}</h2>
            <p>Email: {organization.email}</p>
            <p>Phone: {organization.phone_number}</p>
            <p>{organization.description}</p>
          </div>
        )}
          </div>
        </div>
  );
 
}