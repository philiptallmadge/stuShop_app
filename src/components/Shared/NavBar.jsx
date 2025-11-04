import { Link } from "react-router-dom" 
import './NavBar.css'

export default function NavBar() {

        return (
        <nav>
        <div className="nav-container">
            <h1 id="title">Student Shop</h1>
            <div>
            <ul className="nav-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/create-account">Create Account</Link></li>
            </ul>
            </div>
        </div>
        </nav>
    );
}

        