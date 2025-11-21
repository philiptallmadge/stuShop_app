import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateAccount.module.css"; // Import the CSS Module

export default function CreateAccount() {
  const [level, setLevel] = useState("");
  const [employeeData, setEmployeeData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });
  const [orgData, setOrgData] = useState({
    name: "",
    email: "",
    phone_number: "",
    username: "",
    password: "",
  });
  const [customerData, setCustomerData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // const handleChange = (e, isOrg = false) => {
  //   const { name, value } = e.target;
  //   if (isOrg) {
  //     setOrgData({ ...orgData, [name]: value });
  //   } else {
  //     setEmployeeData({ ...employeeData, [name]: value });
  //   } else {
  //     setCustomerData({ ...customerData, [name]: value });
  //   }
  // };
  const handleChange = (e, isOrg = false) => {
  const { name, value } = e.target;

  if (level === "1") {
    setEmployeeData({ ...employeeData, [name]: value });
  } else if (level === "2") {
    setOrgData({ ...orgData, [name]: value });
  } else if (level === "3") {
    setCustomerData({ ...customerData, [name]: value });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData;
    if (level === "1") {
      formData = { level, ...employeeData };
    } else if (level === "2") {
      formData = { level, ...orgData };
    } else if (level === "3") {
      formData = { level, ...customerData };
    }
    else {
      alert("Please select a valid level");
      return;
    }

    try {
      const res = await fetch("http://129.74.153.235:5000/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Account created successfully!");
        navigate("/");
      } else {
        alert("Error creating account.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error.");
    }
  };

  return (
    // Replaced: min-h-screen flex flex-col items-center justify-center bg-gray-100
    <div className={styles.createAccountContainer}>
      {/* Replaced: bg-white p-8 rounded-2xl shadow-md w-96 */}
      <div className={styles.createAccountCard}>
        {/* Replaced: text-2xl font-semibold text-center mb-6 */}
        <h2 className={styles.createAccountHeader}>
          Create Account
        </h2>

        {/* Replaced: flex flex-col space-y-4 */}
        <form onSubmit={handleSubmit} className={styles.createAccountForm}>
          {/* Replaced: border p-2 rounded-md */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={styles.inputField} // Reusing inputField style for select
            required
          >
            <option value="">Select Account Type</option>
            <option value="1">Employee</option>
            <option value="2">Organization</option>
            <option value="3">Customer</option>
          </select>

          {/* Level 1: Employee Fields */}
          {level === "1" && (
            <>
              <input name="first_name" placeholder="First Name" value={employeeData.first_name} onChange={handleChange} className={styles.inputField} required />
              <input name="last_name" placeholder="Last Name" value={employeeData.last_name} onChange={handleChange} className={styles.inputField} required />
              <input name="email" type="email" placeholder="Email" value={employeeData.email} onChange={handleChange} className={styles.inputField} required />
              <input name="username" placeholder="Username" value={employeeData.username} onChange={handleChange} className={styles.inputField} required />
              <input name="password" type="password" placeholder="Password" value={employeeData.password} onChange={handleChange} className={styles.inputField} required />
            </>
          )}

          {/* Level 2: Organization Fields */}
          {level === "2" && (
            <>
              <input name="name" placeholder="Organization Name" value={orgData.name} onChange={handleChange} className={styles.inputField} required />
              <input name="email" type="email" placeholder="Email" value={orgData.email} onChange={handleChange} className={styles.inputField} required />
              <input name="phone_number" placeholder="Phone Number" value={orgData.phone_number} onChange={handleChange} className={styles.inputField} required />
              <input name="username" placeholder="Username" value={orgData.username} onChange={handleChange} className={styles.inputField} required />
              <input name="password" type="password" placeholder="Password" value={orgData.password} onChange={handleChange} className={styles.inputField} required />
            </>
          )}
          
          {/* Level 3: Customer Fields */}
          {level === "3" && (
            <>
              <input name="first_name" placeholder="First Name" value={customerData.first_name} onChange={handleChange} className={styles.inputField} required />
              <input name="last_name" placeholder="Last Name" value={customerData.last_name} onChange={handleChange} className={styles.inputField} required />
              <input name="email" type="email" placeholder="Email" value={customerData.email} onChange={handleChange} className={styles.inputField} required />
              <input name="phone_number" placeholder="Phone Number" value={customerData.phone_number} onChange={handleChange} className={styles.inputField} required />
              <input name="username" placeholder="Username" value={customerData.username} onChange={handleChange} className={styles.inputField} required />
              <input name="password" type="password" placeholder="Password" value={customerData.password} onChange={handleChange} className={styles.inputField} required />
            </>
          )}  

          {/* Replaced: bg-green-500 text-white rounded-md p-2 hover:bg-green-600 transition */}
          <button
            type="submit"
            className={styles.submitButton} 
          >
            Create Account
          </button>
        </form>

        {/* Replaced: mt-6 text-center */}
        <div className={styles.linkGroup}>
          {/* Replaced: text-blue-500 hover:underline */}
          <button
            onClick={() => navigate("/login")}
            className={styles.navLink}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}