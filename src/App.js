import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/Auth/SignIn";
import CreateAccount from "./components/Auth/CreateAccount";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Employee from "./components/Employee/Employee";
import Organization from "./components/Organization/Organization";
import NewListing from "./components/Organization/AddingListing";
import Home from "./components/Home/Home"
import NavBar from "./components/Shared/NavBar"
import Customer from "./components/Customer/Customer";
import CustomerSeeListings from "./components/Customer/SeeListings";
import CustomerPlaceOrder from "./components/Customer/PlaceOrder";
import ShoppingCart from "./components/Customer/ShopingCart";
import CustomerAllListings from "./components/Customer/SeeAllListings";
import OrganizationSeeOrders from "./components/Organization/OrganizationSeeOrders";

export default function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ paddingTop: "80px" }}>
        <Routes>
        {/* <Route path="/" element={<SignIn />} /> */}
          <Route path="/" element={<Home />} />
          <Route  path="/login" element={<SignIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/organization/add-listing" element={<NewListing />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/customer/org/:orgId" element={<CustomerSeeListings />} />
          <Route path="/customer/listing/:listingId" element={<CustomerPlaceOrder />} />
          <Route path="/customer/cart" element={<ShoppingCart />} />
          <Route path="/customer/all-listings" element={<CustomerAllListings />} />
          <Route path="/organization/orders/:listingId" element={<OrganizationSeeOrders />} />
          {/* <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/organization" element={<OrganizationDashboard />} />
          <Route path="/customer" element={<CustomerPage />} /> */}
      </Routes>
       </div>
    </Router>
  );
}
