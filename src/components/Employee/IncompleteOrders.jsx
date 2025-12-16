import styles from "./Employee.module.css"; 
export default function IncompleteOrders({
  orders,
  onMarkComplete,
  loading,
  error,
}) {
  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>No incomplete orders 🎉</p>;
  }

  return (
    <div className={styles.listingsContainer}>
        <h2 className={styles.sectionHeader}>Incomplete Orders</h2>
            <ul className={`${styles.orgList} ${styles.scrollableList}`}>
              {orders.map((order) => (
                <li
                  key={order.id}
                  className={`${styles.listingItem}`}
                >
                <strong>ID: {order.id}</strong> | {order.first_name} ${order.last_name} | {order.event_name} | {order.paid} | {order.qty} | 
                  <button
                    onClick={() => onMarkComplete(order.id)}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Mark as Completed
                  </button>
                </li>
              ))}
            </ul>
    </div>
  );
}