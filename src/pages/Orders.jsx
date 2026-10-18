import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/api';
import { useAuth } from '../context/useAuth';

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await getUserOrders(user.userId);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="page-message">
        <div className="orders-message-icon">🔐</div>

        <h1>My Orders</h1>

        <p>Please login to view your orders.</p>

        <button onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-message">
        <div className="loading-spinner"></div>

        <h2>Loading orders...</h2>

        <p>Please wait while we fetch your orders.</p>
      </div>
    );
  }

  return (
    <div className="orders-page">

      {/* Page Header */}
      <div className="orders-page-header">
        <div>
          <span className="orders-page-label">
            Your Shopping Activity
          </span>

          <h1>My Orders</h1>

          <p>
            Track and manage all your orders in one place.
          </p>
        </div>

        <Link
          to="/products"
          className="continue-shopping-link"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="orders-error">
          ⚠️ {error}
        </div>
      )}

      {/* Empty Orders */}
      {orders.length === 0 ? (
        <div className="empty-orders">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
            Start shopping and your orders will appear here.
          </p>

          <Link to="/products">
            <button className="start-shopping-button">
              Start Shopping
            </button>
          </Link>

        </div>
      ) : (
        <div className="orders-container">

          {/* Order Count */}
          <div className="orders-count">
            <strong>
              {orders.length}
            </strong>{' '}
            {orders.length === 1 ? 'Order' : 'Orders'}
          </div>

          {/* Orders */}
          <div className="orders-list">

            {orders.map((order) => {

              /*
               * Order status sequence
               */
              const statusSteps = [
                'PLACED',
                'CONFIRMED',
                'SHIPPED',
                'DELIVERED'
              ];

              const currentStatusIndex =
                statusSteps.indexOf(order.status);

              return (
                <div
                  className="order-card"
                  key={order.orderId}
                >

                  {/* Order Card Header */}
                  <div className="order-card-header">

                    <div className="order-id-section">

                      <div className="order-box-icon">
                        📦
                      </div>

                      <div>
                        <span className="order-label">
                          Product
                        </span>

                        <h2>
                          {order.items &&
                          order.items.length > 0
                            ? order.items
                                .map(
                                  (item) =>
                                    item.productName
                                )
                                .join(', ')
                            : 'Product'}
                        </h2>

                        <span className="order-number">
                          Order #{order.orderId}
                        </span>
                      </div>

                    </div>

                    {/* Current Status Badge */}
                    <span
                      className={`order-status order-status-${order.status?.toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                  </div>


                  {/* Order Information */}
                  <div className="order-info-grid">

                    <div className="order-info-item">
                      <span>
                        Order Date
                      </span>

                      <strong>
                        {order.orderDate
                          ? new Date(
                              order.orderDate
                            ).toLocaleString()
                          : 'N/A'}
                      </strong>
                    </div>


                    <div className="order-info-item">
                      <span>
                        Total Amount
                      </span>

                      <strong className="order-price">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toFixed(2)}
                      </strong>
                    </div>


                    <div className="order-info-item">
                      <span>
                        Items
                      </span>

                      <strong>
                        {order.items?.length || 0}
                      </strong>
                    </div>

                  </div>


                  {/* Status Timeline */}
                  {order.status !== 'CANCELLED' && (
                    <div className="order-timeline-section">

                      <h3>
                        Order Status
                      </h3>

                      <div className="order-timeline">

                        {/* PLACED */}
                        <div
                          className={`timeline-step ${
                            currentStatusIndex > 0
                              ? 'completed'
                              : currentStatusIndex === 0
                                ? 'current'
                                : ''
                          }`}
                        >
                          <div className="timeline-dot">
                            ✓
                          </div>

                          <span>
                            Placed
                          </span>
                        </div>


                        {/* Line 1 */}
                        <div
                          className={`timeline-line ${
                            currentStatusIndex > 0
                              ? 'completed'
                              : ''
                          }`}
                        ></div>


                        {/* CONFIRMED */}
                        <div
                          className={`timeline-step ${
                            currentStatusIndex > 1
                              ? 'completed'
                              : currentStatusIndex === 1
                                ? 'current'
                                : ''
                          }`}
                        >
                          <div className="timeline-dot">
                            ✓
                          </div>

                          <span>
                            Confirmed
                          </span>
                        </div>


                        {/* Line 2 */}
                        <div
                          className={`timeline-line ${
                            currentStatusIndex > 1
                              ? 'completed'
                              : ''
                          }`}
                        ></div>


                        {/* SHIPPED */}
                        <div
                          className={`timeline-step ${
                            currentStatusIndex > 2
                              ? 'completed'
                              : currentStatusIndex === 2
                                ? 'current'
                                : ''
                          }`}
                        >
                          <div className="timeline-dot">
                            ✓
                          </div>

                          <span>
                            Shipped
                          </span>
                        </div>


                        {/* Line 3 */}
                        <div
                          className={`timeline-line ${
                            currentStatusIndex > 2
                              ? 'completed'
                              : ''
                          }`}
                        ></div>


                        {/* DELIVERED */}
                        <div
                          className={`timeline-step ${
                            currentStatusIndex === 3
                              ? 'current'
                              : ''
                          }`}
                        >
                          <div className="timeline-dot">
                            ✓
                          </div>

                          <span>
                            Delivered
                          </span>
                        </div>

                      </div>

                    </div>
                  )}


                  {/* Cancelled Status */}
                  {order.status === 'CANCELLED' && (
                    <div className="cancelled-order-message">
                      ❌ This order has been cancelled.
                    </div>
                  )}


                  {/* Card Footer */}
                  <div className="order-card-footer">

                    <span className="order-footer-note">
                      Need more information about this order?
                    </span>

                    <Link
                      to={`/orders/${order.orderId}`}
                    >
                      <button className="view-order-button">
                        View Order Details
                        <span>→</span>
                      </button>
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      )}

    </div>
  );
}

export default Orders;