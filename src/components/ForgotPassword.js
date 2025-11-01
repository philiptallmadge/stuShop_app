import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [newData, setnewData] = useState({
    username: "",
    new_password: "",
  });
    const navigate = useNavigate();
    const handleChange = (e) => {
    const { name, value } = e.target;
    setnewData({ ...newData, [name]: value });
  }
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
        if (res.ok) {
        alert("Password changed successfully!");
        navigate("/");
      } else {
        alert("Error changing password.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error.");
    }
  }

    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-96">
            <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={newData.username}
                    onChange={handleChange}
                    className="border p-2 rounded-md"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    name="new_password"
                    value={newData.new_password}
                    onChange={handleChange}
                    className="border p-2 rounded-md"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
                >
                    Change Password
                </button>
            </form>
        </div>
    </div>
  );


}