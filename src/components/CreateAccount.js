import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleChange = (e, isOrg = false) => {
    const { name, value } = e.target;
    if (isOrg) {
      setOrgData({ ...orgData, [name]: value });
    } else {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData;
    if (level === "1") {
      formData = { level, ...employeeData };
    } else if (level === "2") {
      formData = { level, ...orgData };
    } else {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border p-2 rounded-md"
            required
          >
            <option value="">Select Account Type</option>
            <option value="1">Employee</option>
            <option value="2">Organization</option>
          </select>

          {level === "1" && (
            <>
              <input
                name="first_name"
                placeholder="First Name"
                value={employeeData.first_name}
                onChange={handleChange}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="last_name"
                placeholder="Last Name"
                value={employeeData.last_name}
                onChange={handleChange}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={employeeData.email}
                onChange={handleChange}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="username"
                placeholder="Username"
                value={employeeData.username}
                onChange={handleChange}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={employeeData.password}
                onChange={handleChange}
                className="border p-2 rounded-md"
                required
              />
            </>
          )}

          {level === "2" && (
            <>
              <input
                name="name"
                placeholder="Organization Name"
                value={orgData.name}
                onChange={(e) => handleChange(e, true)}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={orgData.email}
                onChange={(e) => handleChange(e, true)}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="phone_number"
                placeholder="Phone Number"
                value={orgData.phone_number}
                onChange={(e) => handleChange(e, true)}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="username"
                placeholder="Username"
                value={orgData.username}
                onChange={(e) => handleChange(e, true)}
                className="border p-2 rounded-md"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={orgData.password}
                onChange={(e) => handleChange(e, true)}
                className="border p-2 rounded-md"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 transition"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-500 hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

