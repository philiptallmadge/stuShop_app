// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAllCompletedOrders } from "../../Services/organizationService.js";
// import styles from "./OrganizationSeeOrders.module.css";

// export default function OrganizationSeeOrders() {
//   const navigate = useNavigate();
//   const { listingId } = useParams();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           navigate("/");
//           return;
//         }

//         const ordersData = await getAllCompletedOrders(listingId, token);
//         console.log("Fetched orders:", ordersData);
//         setOrders(ordersData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//         setError("Failed to load orders");
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [listingId, navigate]);

//   // Filter orders based on search term
//   const filteredOrders = orders.filter((order) => {
//     const fullName = `${order.first_name} ${order.last_name}`.toLowerCase();
//     const email = order.email?.toLowerCase() || "";
//     const orderId = order.id?.toString() || "";
//     const search = searchTerm.toLowerCase();

//     return (
//       fullName.includes(search) ||
//       email.includes(search) ||
//       orderId.includes(search)
//     );
//   });

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <p className={styles.loadingMessage}>Loading orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.container}>
//         <p className={styles.errorMessage}>{error}</p>
//         <button 
//           className={styles.backButton}
//           onClick={() => navigate("/organization")}
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   // Calculate total revenue from filtered orders
//   const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.paid || 0), 0);
//   const totalQuantity = filteredOrders.reduce((sum, order) => sum + parseInt(order.qty || 0), 0);

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h2 className={styles.title}>Completed Orders Dashboard</h2>
//         <button 
//           className={styles.backButton}
//           onClick={() => navigate("/organization")}
//         >
//           Back to Dashboard
//         </button>
//       </div>

//       {orders.length > 0 && (
//         <div className={styles.summarySection}>
//           <div className={styles.summaryCard}>
//             <h3>Total Orders</h3>
//             <p className={styles.summaryNumber}>
//               {searchTerm ? `${filteredOrders.length} / ${orders.length}` : orders.length}
//             </p>
//           </div>
//           <div className={styles.summaryCard}>
//             <h3>Total Items Sold</h3>
//             <p className={styles.summaryNumber}>{totalQuantity}</p>
//           </div>
//           <div className={styles.summaryCard}>
//             <h3>Total Revenue</h3>
//             <p className={styles.summaryNumber}>${totalRevenue.toFixed(2)}</p>
//           </div>
//         </div>
//       )}

//       {orders.length === 0 ? (
//         <div className={styles.emptyState}>
//           <p>No completed orders yet for this listing.</p>
//         </div>
//       ) : (
//         <div className={styles.ordersSection}>
//           <h3 className={styles.sectionTitle}>
//             {orders[0]?.event_name ? `Orders for: ${orders[0].event_name}` : 'Orders'}
//           </h3>
          
//           <div className={styles.searchContainer}>
//             <input
//               type="text"
//               placeholder="Search by name, email, or order ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={styles.searchInput}
//             />
//           </div>

//           {filteredOrders.length === 0 ? (
//             <div className={styles.emptyState}>
//               <p>No orders found matching "{searchTerm}"</p>
//             </div>
//           ) : (
//             <div className={styles.ordersTable}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Customer Name</th>
//                     <th>Email</th>
//                     <th>Quantity</th>
//                     <th>Total Price</th>
//                     <th>Order Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr key={order.id}>
//                       <td>#{order.id}</td>
//                       <td>{order.first_name} {order.last_name}</td>
//                       <td>{order.email || "studentxyw@nd.edu"}</td>
//                       <td>{order.qty}</td>
//                       <td className={styles.totalPrice}>
//                         ${parseFloat(order.paid).toFixed(2)}
//                       </td>
//                       <td>
//                         {new Date(order.date_purchased).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCompletedOrders } from "../../Services/organizationService.js";
import * as XLSX from "xlsx";
import styles from "./OrganizationSeeOrders.module.css";

export default function OrganizationSeeOrders() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        const ordersData = await getAllCompletedOrders(listingId, token);
        console.log("Fetched orders:", ordersData);
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [listingId, navigate]);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const fullName = `${order.first_name} ${order.last_name}`.toLowerCase();
    const email = order.email?.toLowerCase() || "";
    const orderId = order.id?.toString() || "";
    const search = searchTerm.toLowerCase();

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      orderId.includes(search)
    );
  });

  // Function to download orders as Excel
  const downloadExcel = () => {
    // Prepare data for Excel
    const excelData = filteredOrders.map((order) => ({
      "Order ID": order.id,
      "Customer Name": `${order.first_name} ${order.last_name}`,
      "Email": order.email || "studentxyw@nd.edu",
      "Quantity": order.qty,
      "Total Price": parseFloat(order.paid).toFixed(2),
      "Order Date": new Date(order.date_purchased).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 10 },  // Order ID
      { wch: 20 },  // Customer Name
      { wch: 30 },  // Email
      { wch: 10 },  // Quantity
      { wch: 12 },  // Total Price
      { wch: 20 }   // Order Date
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Generate filename
    const eventName = orders[0]?.event_name || 'Listing';
    const date = new Date().toISOString().split('T')[0];
    const filename = `${eventName}_Orders_${date}.xlsx`;

    // Download
    XLSX.writeFile(workbook, filename);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingMessage}>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate("/organization")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Calculate total revenue from filtered orders
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.paid || 0), 0);
  const totalQuantity = filteredOrders.reduce((sum, order) => sum + parseInt(order.qty || 0), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Completed Orders Dashboard</h2>
        <div className={styles.headerButtons}>
          {orders.length > 0 && (
            <button 
              className={styles.downloadButton}
              onClick={downloadExcel}
            >
              📊 Download Excel
            </button>
          )}
          <button 
            className={styles.backButton}
            onClick={() => navigate("/organization")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {orders.length > 0 && (
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Total Orders</h3>
            <p className={styles.summaryNumber}>
              {searchTerm ? `${filteredOrders.length} / ${orders.length}` : orders.length}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Items Sold</h3>
            <p className={styles.summaryNumber}>{totalQuantity}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Revenue</h3>
            <p className={styles.summaryNumber}>${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No completed orders yet for this listing.</p>
        </div>
      ) : (
        <div className={styles.ordersSection}>
          <h3 className={styles.sectionTitle}>
            {orders[0]?.event_name ? `Orders for: ${orders[0].event_name}` : 'Orders'}
          </h3>
          
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by name, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No orders found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className={styles.ordersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.first_name} {order.last_name}</td>
                      <td>{order.email || "studentxyw@nd.edu"}</td>
                      <td>{order.qty}</td>
                      <td className={styles.totalPrice}>
                        ${parseFloat(order.paid).toFixed(2)}
                      </td>
                      <td>
                        {new Date(order.date_purchased).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}