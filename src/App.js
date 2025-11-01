// import { useEffect, useState } from "react";
// import "./App.css";

// function App() {
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/employees")  // your Flask endpoint
//       .then((response) => response.json())
//       .then((data) => setEmployees(data))
//       .catch((error) => console.error("Error fetching employees:", error));
//   }, []);

//   return (
//     <div className="App">
//       <h1>Welcome to StuShop</h1>
//       <h2>Employee List:</h2>
//       <ul>
//         {employees.map((emp) => (
//           <li key={emp.id}>
//             {emp.first_name} {emp.last_name} — {emp.email}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import CreateAccount from "./components/CreateAccount";
import ForgotPassword from "./components/ForgotPassword";
import Employee from "./components/Employee/Employee";
import Organization from "./components/Organization";

// import EmployeeDashboard from "./components/EmployeeDashboard";
// import OrganizationDashboard from "./components/OrganizationDashboard";
// import CustomerPage from "./components/CustomerPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/organization" element={<Organization />} />
        {/* <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/organization" element={<OrganizationDashboard />} />
        <Route path="/customer" element={<CustomerPage />} /> */}
      </Routes>
    </Router>
  );
}
