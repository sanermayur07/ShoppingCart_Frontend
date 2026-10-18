import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getOrderById,
  getPaymentByOrderId,
  updateOrderStatus,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function AdminOrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        setSelectedStatus(orderData.status);

        try {
          const paymentData = await getPaymentByOrderId(orderId);
          setPayment(paymentData);
        } catch {
          setPayment(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, orderId]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) {
      return;
    }

    try {
      setUpdating(true);
      setError('');
      setMessage('');

      const updatedOrder = await updateOrderStatus(
        orderId,
        selectedStatus
      );

      setOrder(updatedOrder);
      setMessage('Order status updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-message">
        <h1>Access Denied</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-message">
        <h2>Loading order details...</h2>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="page-message">
        <h2>Unable to load order</h2>
        <p className="error-message">{error}</p>

        <button onClick={() => navigate('/admin/orders')}>
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="admin-order-details">

      {/* Header */}
      <div className="admin-order-header">
        <div>
          <h1>Order #{order.orderId}</h1>

          <p>
            Order Date:{' '}
            {order.orderDate
              ? new Date(order.orderDate).toLocaleString()
              : 'N/A'}
          </p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate('/admin/orders')}
        >
          ← Back to Orders
        </button>
      </div>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* Order Information */}
      <div className="admin-order-grid">

        <div className="admin-order-card">
          <h2>Order Information</h2>

          <div className="info-row">
            <span>Order ID</span>
            <strong>#{order.orderId}</strong>
          </div>

          <div className="info-row">
            <span>User ID</span>
            <strong>{order.userId}</strong>
          </div>

          <div className="info-row">
            <span>Order Date</span>
            <strong>
              {order.orderDate
                ? new Date(order.orderDate).toLocaleString()
                : 'N/A'}
            </strong>
          </div>

          <div className="info-row">
            <span>Total Amount</span>
            <strong className="order-amount">
              ₹{order.totalAmount}
            </strong>
          </div>

          <div className="info-row">
            <span>Status</span>

            <span className={`status-badge ${order.status?.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Status Management */}
        <div className="admin-order-card">
          <h2>Update Order Status</h2>

          <label>Order Status</label>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="PLACED">PLACED</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button
            className="update-status-button"
            onClick={handleStatusUpdate}
            disabled={
              updating ||
              selectedStatus === order.status
            }
          >
            {updating
              ? 'Updating...'
              : 'Update Status'}
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="admin-order-card products-section">
        <h2>Ordered Products</h2>

        {order.items && order.items.length > 0 ? (
          <div className="order-items-table">

            <div className="order-item-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            {order.items.map((item) => (
              <div
                className="order-item-row"
                key={item.orderItemId}
              >
                <span>
                  {item.productName}
                </span>

                <span>
                  ₹{item.price}
                </span>

                <span>
                  {item.quantity}
                </span>

                <span>
                  ₹{item.subtotal}
                </span>
              </div>
            ))}

          </div>
        ) : (
          <p>No products found for this order.</p>
        )}
      </div>

      {/* Payment */}
      <div className="admin-order-card payment-section">
        <h2>Payment Information</h2>

        {payment ? (
          <div className="payment-grid">

            <div className="info-row">
              <span>Payment ID</span>
              <strong>{payment.paymentId}</strong>
            </div>

            <div className="info-row">
              <span>Payment Status</span>
              <strong>
                {payment.paymentStatus}
              </strong>
            </div>

            <div className="info-row">
              <span>Payment Method</span>
              <strong>
                {payment.paymentMethod}
              </strong>
            </div>

            <div className="info-row">
              <span>Amount Paid</span>
              <strong>
                ₹{payment.amount}
              </strong>
            </div>

            <div className="info-row">
              <span>Card</span>
              <strong>
                **** **** **** {payment.cardLastFour}
              </strong>
            </div>

            <div className="info-row">
              <span>Cardholder</span>
              <strong>
                {payment.cardholderName}
              </strong>
            </div>

            <div className="info-row">
              <span>Transaction ID</span>
              <strong className="transaction-id">
                {payment.transactionId}
              </strong>
            </div>

            <div className="info-row">
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
        ) : (
          <p className="no-payment">
            No payment information found for this order.
          </p>
        )}
      </div>

    </div>
  );
}

export default AdminOrderDetails;