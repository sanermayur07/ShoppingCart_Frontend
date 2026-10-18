import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllOrders,
  updateOrderStatus,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function AdminOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      setError('');
      setMessage('');

      const updatedOrder = await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status: updatedOrder.status,
              }
            : order
        )
      );

      setMessage(`Order #${orderId} status updated to ${status}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-message">
        <h1>Access Denied</h1>
        <p>
          You are not authorized to access the admin order management.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Orders...</h2>
        </div>
      </div>
    );
  }

  const search = searchTerm.toLowerCase().trim();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.orderId).includes(search) ||
      String(order.userId).includes(search) ||
      String(order.totalAmount).includes(search);

    const matchesStatus =
      statusFilter === 'ALL' ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-header">
        <div>
          <h1>Manage Orders</h1>
          <p>View and manage customer orders</p>
        </div>

        <div className="order-count">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
      </div>

      {message && (
        <div className="admin-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      <div className="order-filters">

        <div className="order-search">
          <label>Search Orders</label>

          <input
            type="text"
            placeholder="Search by Order ID, User ID or Amount"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="order-status-filter">
          <label>Filter by Status</label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Orders</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders-admin">
          <div className="empty-order-icon">📦</div>

          <h2>No Orders Found</h2>

          <p>
            No orders match your current search or filter.
          </p>
        </div>
      ) : (
        <div className="admin-orders-grid">

          {filteredOrders.map((order) => (

            <div
              className="admin-order-card"
              key={order.orderId}
            >

              <div className="admin-order-card-header">

                <div>
                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>#{order.orderId}</h2>
                </div>

                <span
                  className={`order-status-badge ${String(
                    order.status || ''
                  ).toLowerCase()}`}
                >
                  {order.status}
                </span>

              </div>

              <div className="admin-order-info">

                <div className="order-info-row">
                  <span>Customer ID</span>
                  <strong>{order.userId}</strong>
                </div>

                <div className="order-info-row">
                  <span>Order Date</span>
                  <strong>
                    {order.orderDate
                      ? new Date(
                          order.orderDate
                        ).toLocaleString()
                      : 'N/A'}
                  </strong>
                </div>

                <div className="order-info-row">
                  <span>Total Amount</span>
                  <strong className="order-total">
                    ₹{order.totalAmount}
                  </strong>
                </div>

                <div className="order-info-row">
                  <span>Items</span>
                  <strong>
                    {order.items
                      ? order.items.length
                      : 0}
                  </strong>
                </div>

              </div>

              <div className="admin-order-actions">

              <Link to={`/admin/orders/${order.orderId}`}>
               <button className="view-order-button">
                     View Details
                </button>
              </Link>

                <select
                  value={order.status || ''}
                  onChange={(e) =>
                    handleStatusChange(
                      order.orderId,
                      e.target.value
                    )
                  }
                  disabled={
                    updatingOrderId === order.orderId
                  }
                >
                  <option value="PLACED">
                    Placed
                  </option>

                  <option value="CONFIRMED">
                    Confirmed
                  </option>

                  <option value="SHIPPED">
                    Shipped
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;