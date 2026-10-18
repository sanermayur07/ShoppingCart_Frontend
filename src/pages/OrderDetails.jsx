import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById, getPaymentByOrderId } from '../services/api';
import { useAuth } from '../context/useAuth';

function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState(null);

  useEffect(() => {
  if (!user) {
    return;
  }

  const loadOrder = async () => {
    try {
      setError('');

      const data = await getOrderById(orderId);
      setOrder(data);

      const paymentData =
        await getPaymentByOrderId(orderId);

      setPayment(paymentData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadOrder();
}, [user, orderId]);
  if (!user) {
    return (
      <div className="page-message">
        <div className="message-icon">🔐</div>

        <h1>Order Details</h1>

        <p>Please login to view your order.</p>

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
        <h2>Loading order details...</h2>
        <p>Please wait while we fetch your order information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-message">
        <div className="message-icon">⚠️</div>

        <h2>Unable to Load Order</h2>

        <p className="error-message">{error}</p>

        <button onClick={() => navigate('/orders')}>
          Back to My Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-message">
        <div className="message-icon">📦</div>

        <h2>Order Not Found</h2>

        <p>
          The requested order could not be found.
        </p>

        <button onClick={() => navigate('/orders')}>
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-details-page">

      {/* Header */}
      <div className="order-details-header">
        <div>
          <span className="order-success-badge">
            ✓ Order Confirmed
          </span>

          <h1>Order Details</h1>

          <p>
            Thank you for your purchase. Here are your order details.
          </p>
        </div>

        <button
          className="back-orders-button"
          onClick={() => navigate('/orders')}
        >
          ← My Orders
        </button>
      </div>

      {/* Order Overview */}
      <div className="order-overview-card">

        <div className="order-overview-item">
          <span className="overview-label">Order ID</span>
          <strong>#{order.orderId}</strong>
        </div>

        <div className="order-overview-item">
          <span className="overview-label">Order Status</span>

          <span
            className={`order-status status-${order.status?.toLowerCase()}`}
          >
            {order.status}
          </span>
        </div>

        <div className="order-overview-item">
          <span className="overview-label">Order Date</span>

          <strong>
            {order.orderDate
              ? new Date(order.orderDate).toLocaleString()
              : 'N/A'}
          </strong>
        </div>

        <div className="order-overview-item">
          <span className="overview-label">Total Amount</span>

          <strong className="order-total-highlight">
            ₹{Number(order.totalAmount || 0).toFixed(2)}
          </strong>
        </div>

      </div>

      {/* Main Content */}
      <div className="order-details-layout">

        {/* Left Section */}
        <div className="order-details-main">

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <section className="order-details-card">

              <div className="section-heading">
                <div className="section-heading-icon">
                  🛍️
                </div>

                <div>
                  <h2>Order Items</h2>
                  <p>
                    {order.items.length}{' '}
                    {order.items.length === 1 ? 'item' : 'items'} in this order
                  </p>
                </div>
              </div>

              <div className="order-items-list">

                {order.items.map((item) => (
                  <div
                    className="order-item-card"
                    key={item.orderItemId}
                  >
                    <div className="order-item-icon">
                      🛒
                    </div>

                    <div className="order-item-info">
                      <h3>
                        {item.productName || 'Product'}
                      </h3>

                      <div className="order-item-meta">
                        <span>
                          Quantity: <strong>{item.quantity}</strong>
                        </span>

                        <span>
                          Price: <strong>₹{item.price}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="order-item-total">
                      <span>Item Total</span>

                      <strong>
                        ₹
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 0)
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}

              </div>
            </section>
          )}

          {/* Payment Details */}
          {payment && (
            <section className="order-details-card payment-details-card">

              <div className="section-heading">
                <div className="section-heading-icon">
                  💳
                </div>

                <div>
                  <h2>Payment Details</h2>
                  <p>Your payment information</p>
                </div>
              </div>

              <div className="payment-details-grid">

                <div className="payment-detail-item">
                  <span>Payment ID</span>
                  <strong>{payment.paymentId}</strong>
                </div>

                <div className="payment-detail-item">
                  <span>Payment Status</span>

                  <strong className="payment-success">
                    ✓ {payment.paymentStatus}
                  </strong>
                </div>

                <div className="payment-detail-item">
                  <span>Payment Method</span>
                  <strong>{payment.paymentMethod}</strong>
                </div>

                <div className="payment-detail-item">
                  <span>Amount Paid</span>
                  <strong>
                    ₹{Number(payment.amount || 0).toFixed(2)}
                  </strong>
                </div>

                <div className="payment-detail-item">
                  <span>Card</span>
                  <strong>
                    **** **** **** {payment.cardLastFour}
                  </strong>
                </div>

                <div className="payment-detail-item">
                  <span>Cardholder Name</span>
                  <strong>
                    {payment.cardholderName}
                  </strong>
                </div>

                <div className="payment-detail-item">
                  <span>Transaction ID</span>
                  <strong className="transaction-id">
                    {payment.transactionId}
                  </strong>
                </div>

                <div className="payment-detail-item">
                  <span>Payment Date</span>
                  <strong>
                    {payment.paymentDate
                      ? new Date(
                          payment.paymentDate
                        ).toLocaleString()
                      : 'N/A'}
                  </strong>
                </div>

              </div>

              <div className="payment-security-note">
                🔒 Your card details are securely protected.
                Only the last four digits of your card are displayed.
              </div>

            </section>
          )}

        </div>

        {/* Right Summary */}
        <aside className="order-summary-card">

          <div className="summary-icon">
            ✓
          </div>

          <h2>Order Confirmed</h2>

          <p className="summary-message">
            Your order has been successfully placed.
          </p>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Order ID</span>
            <strong>#{order.orderId}</strong>
          </div>

          <div className="summary-row">
            <span>Items</span>
            <strong>
              {order.items?.length || 0}
            </strong>
          </div>

          <div className="summary-row">
            <span>Payment</span>
            <strong>
              {payment?.paymentStatus || 'Completed'}
            </strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Paid</span>

            <strong>
              ₹{Number(order.totalAmount || 0).toFixed(2)}
            </strong>
          </div>

          <div className="summary-actions">

            <button
              className="primary-order-button"
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </button>

            <button
              className="secondary-order-button"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>

          </div>

          <div className="order-support-note">
            Need help with your order?
            <br />
            Please contact our support team.
          </div>

        </aside>

      </div>

    </div>
  );
}

export default OrderDetails;