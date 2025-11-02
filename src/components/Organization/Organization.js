import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee} from "../../Services/employeeService.js"
import {getOrganizations, getOrganizationById, createOrganization, updateOrganization, deleteOrganization} from "../../Services/organizationService.js"
import {getListingsByOrganizationId} from "../../Services/organizationService.js"

export default function Organization() {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [listings, setListings] = useState([]);

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
        const orgData = await getOrganizationById(userId, token);
        setOrganization(orgData);

        const listingsData = await getListingsByOrganizationId(userId, token);
        setListings(listingsData);
      } catch (err) {
        console.error("Error fetching organization or listings:", err);
      }
    };

    fetchData();
  }, []);

  if (!organization) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center mb-6">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {organization.name}!
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Your Listings</h2>

        {listings.length === 0 ? (
          <p className="text-gray-500">No listings available.</p>
        ) : (
          <ul className="space-y-3">
            {listings.map((listing) => (
              <li
                key={listing.id}
                className="p-4 border rounded-xl shadow-sm text-left"
              >
                <h3 className="font-bold text-lg">{listing.title}</h3>
                <p className="text-gray-600">{listing.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="bg-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition"
          onClick={() => window.location.reload()}
        >
          Refresh Listings
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
          onClick={() => navigate("/organization/add-listing")}
        >
          Create New Listing
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
          onClick={() => navigate("/")}
        >
          Log out
        </button>
      </div>
    </div>
  );
}