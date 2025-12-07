import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const result = fetch("http://129.74.153.235:5000/sign-in-authentication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    result.then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const level = data.level;
        const access_token = data.access_token;
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("username", name);
        if (level === 1) {
          navigate("/employee");
        } else if (level === 2) {
          navigate("/organization");
        } else {
          alert("Invalid user level.");
        }
      }
      else {
        console.log(username, password)
        alert("Invalid username or password.");
      }
    }).catch((err) => {
      console.error("Error:", err);
      alert("Server error.");
    });
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate("/create-account")}
            className="text-blue-500 hover:underline"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/customer")}
            className="text-blue-500 hover:underline"
          >
            I am a Customer
          </button>
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-500 hover:underline"
          > 
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}
