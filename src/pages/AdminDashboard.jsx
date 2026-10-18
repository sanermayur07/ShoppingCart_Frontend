import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllProducts,
  getAllUsers,
  getAllOrders,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function AdminDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [productsData, usersData, ordersData] =
          await Promise.all([
            getAllProducts(),
            getAllUsers(),
            getAllOrders(),
          ]);

        setProducts(productsData);
        setUsers(usersData);
        setOrders(ordersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-message">
        <h1>Access Denied</h1>
        <p>
          You are not authorized to access the admin dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-message">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;

  const totalRevenue = orders
    .filter((order) => order.status !== 'CANCELLED')
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );

  const placedOrders = orders.filter(
    (order) => order.status === 'PLACED'
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === 'CONFIRMED'
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === 'SHIPPED'
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === 'DELIVERED'
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === 'CANCELLED'
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity) > 0 &&
      Number(product.quantity) <= 5
  );

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.orderDate) -
        new Date(a.orderDate)
    )
    .slice(0, 5);

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome back, <strong>{user.name}</strong>
          </p>
        </div>

        <div className="admin-role">
          ADMIN
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* Statistics */}
      <section className="dashboard-section">
        <h2 className="section-title">
          Dashboard Overview
        </h2>

        <div className="admin-stat-grid">

          <div className="admin-stat-card">
            <div className="stat-icon">📦</div>

            <div>
              <p>Total Products</p>
              <h3>{totalProducts}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">👥</div>

            <div>
              <p>Total Users</p>
              <h3>{totalUsers}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">🛒</div>

            <div>
              <p>Total Orders</p>
              <h3>{totalOrders}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">₹</div>

            <div>
              <p>Total Revenue</p>
              <h3>
                ₹{totalRevenue.toFixed(2)}
              </h3>
            </div>
          </div>

        </div>
      </section>


      {/* Order Status */}
      <section className="dashboard-section">

        <h2 className="section-title">
          Order Status
        </h2>

        <div className="order-status-grid">

          <div className="status-card placed">
            <span>PLACED</span>
            <strong>{placedOrders}</strong>
          </div>

          <div className="status-card confirmed">
            <span>CONFIRMED</span>
            <strong>{confirmedOrders}</strong>
          </div>

          <div className="status-card shipped">
            <span>SHIPPED</span>
            <strong>{shippedOrders}</strong>
          </div>

          <div className="status-card delivered">
            <span>DELIVERED</span>
            <strong>{deliveredOrders}</strong>
          </div>

          <div className="status-card cancelled">
            <span>CANCELLED</span>
            <strong>{cancelledOrders}</strong>
          </div>

        </div>

      </section>


      {/* Recent Orders */}
      <section className="dashboard-section">

        <div className="section-heading-row">
          <h2 className="section-title">
            Recent Orders
          </h2>

          <Link to="/admin/orders">
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="dashboard-empty">
            <p>No orders available.</p>
          </div>
        ) : (
          <div className="recent-orders-table">

            <div className="recent-order-header">
              <span>Order ID</span>
              <span>User ID</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {recentOrders.map((order) => (
              <div
                className="recent-order-row"
                key={order.orderId}
              >
                <span>
                  #{order.orderId}
                </span>

                <span>
                  {order.userId}
                </span>

                <span>
                  ₹{order.totalAmount}
                </span>

                <span>
                  <span
                    className={`dashboard-status ${order.status?.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </span>

                <span>
                  <Link
                    to={`/admin/orders/${order.orderId}`}
                  >
                    <button className="small-view-button">
                      View
                    </button>
                  </Link>
                </span>
              </div>
            ))}

          </div>
        )}

      </section>


      {/* Low Stock */}
      <section className="dashboard-section">

        <div className="section-heading-row">
          <h2 className="section-title">
            Low Stock Products
          </h2>

          <Link to="/admin/products">
            Manage Products →
          </Link>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="stock-safe">
            ✓ All products have sufficient stock.
          </div>
        ) : (
          <div className="low-stock-grid">

            {lowStockProducts.map((product) => (
              <div
                className="low-stock-card"
                key={product.productId}
              >
                <h3>{product.name}</h3>

                <p>
                  Category: {product.category}
                </p>

                <strong>
                  Only {product.quantity} left
                </strong>
              </div>
            ))}

          </div>
        )}

      </section>


      {/* Quick Actions */}
      <section className="dashboard-section">

        <h2 className="section-title">
          Quick Actions
        </h2>

        <div className="quick-actions">

          <Link to="/admin/products">
            <button>
              + Manage Products
            </button>
          </Link>

          <Link to="/admin/users">
            <button>
              👥 Manage Users
            </button>
          </Link>

          <Link to="/admin/orders">
            <button>
              🛒 Manage Orders
            </button>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;