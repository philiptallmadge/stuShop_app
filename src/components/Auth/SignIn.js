import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";

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
        const level = String(data.level); 
        const access_token = data.access_token;

        localStorage.setItem("authToken", access_token);
        console.log("gabbys User level:", level);

        if (level === "1") {
          navigate("/employee");
        } else if (level === "2") {
          navigate("/organization");
        } else if (level === "3") {
          console.log("Navigating to customer dashboard for gabby");
          navigate("/customer");
        } else {
          alert("Invalid user level.");
        }
      } else {
        alert("Invalid username or password.");
      }
    }).catch((err) => {
      console.error("Error:", err);
      alert("Server error.");
    });
    
  };

  return (
    // Replaced min-h-screen, flex, flex-col, etc.
    <div className={styles.signInContainer}>
      {/* Replaced bg-white, p-8, rounded-2xl, shadow-md, w-96 */}
      <div className={styles.signInCard}>
        {/* Replaced text-2xl, font-semibold, text-center, mb-6 */}
        <h2 className={styles.signInHeader}>Sign In</h2>

        {/* Replaced flex, flex-col, space-y-4 */}
        <form onSubmit={handleSignIn} className={styles.signInForm}>
          {/* Replaced border, p-2, rounded-md */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
          />

          {/* Replaced border, p-2, rounded-md */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />

          {/* Replaced bg-blue-500, text-white, rounded-md, p-2, hover:bg-blue-600, transition */}
          <button
            type="submit"
            className={styles.submitButton}
          >
            Sign In
          </button>
        </form>

        {/* Replaced mt-6, flex, justify-between */}
        <div className={styles.linkGroup}>
          {/* Replaced text-blue-500, hover:underline */}
          <button
            onClick={() => navigate("/create-account")}
            className={styles.navLink}
          >
            Create Account
          </button>
          {/* Replaced text-blue-500, hover:underline */}
          <button
            onClick={() => navigate("/forgot-password")}
            className={styles.navLink}
          > 
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}