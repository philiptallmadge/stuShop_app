import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee} from "../../Services/employeeService.js"
import {getOrganizations, getOrganizationById, createOrganization, updateOrganization, deleteOrganization} from "../../Services/organizationService.js"
export default function Employee() {
    const [employee, setEmployee] = useState(null);

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
          </div>
        </div>
  );
 
}