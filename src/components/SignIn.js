import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Temporary — later you’ll add backend authentication
    console.log("Username:", username, "Password:", password);
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
        </div>
      </div>
    </div>
  );
}
