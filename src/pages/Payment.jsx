import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { processPayment } from '../services/api';
import { useAuth } from '../context/useAuth';

function Payment() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const cardNumber = value
        .replace(/\D/g, '')
        .slice(0, 16);

      setFormData({
        ...formData,
        cardNumber,
      });

      return;
    }

    if (name === 'cvv') {
      const cvv = value
        .replace(/\D/g, '')
        .slice(0, 3);

      setFormData({
        ...formData,
        cvv,
      });

      return;
    }

    if (name === 'expiryDate') {
      const expiryDate = value
        .replace(/\D/g, '')
        .slice(0, 4);

      let formattedExpiry = expiryDate;

      if (expiryDate.length >= 3) {
        formattedExpiry =
          expiryDate.slice(0, 2) +
          '/' +
          expiryDate.slice(2);
      }

      setFormData({
        ...formData,
        expiryDate: formattedExpiry,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    // Prevent duplicate payment requests
    if (loading) {
      return;
    }

    // Card number validation
    if (!/^[0-9]{16}$/.test(formData.cardNumber)) {
      setError(
        'Card number must contain exactly 16 digits.'
      );
      return;
    }

    // Cardholder name validation
    if (formData.cardholderName.trim().length < 2) {
      setError(
        'Enter a valid cardholder name.'
      );
      return;
    }

    // Expiry validation
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.expiryDate)) {
      setError(
        'Enter expiry date in MM/YY format.'
      );
      return;
    }

    // CVV validation
    if (!/^[0-9]{3}$/.test(formData.cvv)) {
      setError(
        'CVV must contain exactly 3 digits.'
      );
      return;
    }

    try {
      setLoading(true);
      setPaymentStatus('processing');

      const paymentData = {
        orderId: Number(orderId),
        cardNumber: formData.cardNumber,
        cardholderName: formData.cardholderName.trim(),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };

      /*
       * Keep the processing screen visible for a few seconds.
       * The actual payment API still runs normally.
       */
      await Promise.all([
        processPayment(paymentData),

        new Promise((resolve) =>
          setTimeout(resolve, 3000)
        ),
      ]);

      // Payment completed
      setPaymentStatus('success');

      /*
       * Keep the success screen visible briefly
       * before navigating to the order details page.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      navigate(`/orders/${orderId}`);

    } catch (err) {
      setPaymentStatus('');
      setError(
        err.message || 'Payment failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-message">
        <h1>Payment</h1>

        <p>Please login to continue.</p>

        <button onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">

      {/* ==========================================
          PAYMENT PROCESSING / SUCCESS OVERLAY
      ========================================== */}

      {paymentStatus && (
        <div className="payment-status-overlay">

          <div className="payment-status-card">

            {paymentStatus === 'processing' && (
              <>
                <div className="payment-loader-container">

                  <div className="payment-loader-ring">
                    <div className="payment-loader-dot"></div>
                  </div>

                  <div className="payment-loader-center">
                    ₹
                  </div>

                </div>

                <h2>Processing Payment</h2>

                <p>
                  Please wait while we securely
                  process your payment.
                </p>

                <div className="payment-processing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <small>
                  Please do not refresh or close this page.
                </small>
              </>
            )}

            {paymentStatus === 'success' && (
              <>
                <div className="payment-success-circle">

                  <svg
                    viewBox="0 0 52 52"
                    className="payment-success-check"
                  >
                    <circle
                      cx="26"
                      cy="26"
                      r="24"
                      fill="none"
                    />

                    <path
                      d="M14 27 L22 35 L39 18"
                      fill="none"
                    />
                  </svg>

                </div>

                <h2 className="payment-success-title">
                  Payment Successful!
                </h2>

                <p>
                  Your payment has been completed
                  successfully.
                </p>

                <div className="payment-success-order">
                  Order #{orderId}
                </div>

                <small>
                  Redirecting to your order...
                </small>
              </>
            )}

          </div>

        </div>
      )}

      {/* ==========================================
          PAYMENT HEADER
      ========================================== */}

      <div className="payment-header">

        <div>
          <h1>Payment</h1>

          <p>
            Complete your payment securely.
          </p>
        </div>

        <div className="payment-order-badge">
          Order #{orderId}
        </div>

      </div>

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <p className="error-message payment-error">
          {error}
        </p>
      )}

      {/* ==========================================
          PAYMENT LAYOUT
      ========================================== */}

      <div className="payment-layout">

        {/* ==========================================
            LEFT SIDE - PAYMENT FORM
        ========================================== */}

        <div className="payment-main">

          <div className="payment-section">

            <div className="payment-section-header">

              <div className="payment-step-number">
                1
              </div>

              <div>
                <h2>Payment Details</h2>

                <p>
                  Enter your card details to complete
                  the payment.
                </p>
              </div>

            </div>

            {/* CARD PREVIEW */}

            <div className="payment-card-preview">

              <div className="payment-card-top">

                <span className="payment-card-label">
                  SHOPPING CART
                </span>

                <span className="payment-card-chip">
                  ▰
                </span>

              </div>

              <div className="payment-card-number">

                {formData.cardNumber
                  ? formData.cardNumber
                      .replace(/\s/g, '')
                      .replace(/(.{4})/g, '$1 ')
                      .trim()
                  : '•••• •••• •••• ••••'}

              </div>

              <div className="payment-card-bottom">

                <div>

                  <span className="payment-card-small-label">
                    CARDHOLDER
                  </span>

                  <strong>
                    {formData.cardholderName ||
                      'YOUR NAME'}
                  </strong>

                </div>

                <div>

                  <span className="payment-card-small-label">
                    EXPIRES
                  </span>

                  <strong>
                    {formData.expiryDate || 'MM/YY'}
                  </strong>

                </div>

              </div>

            </div>

            {/* PAYMENT FORM */}

            <form onSubmit={handleSubmit}>

              {/* CARD NUMBER */}

              <div className="form-group payment-form-group">

                <label htmlFor="cardNumber">
                  Card Number
                </label>

                <div className="payment-input-wrapper">

                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Enter 16-digit card number"
                    maxLength="16"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                    disabled={loading}
                  />

                </div>

              </div>

              {/* CARDHOLDER NAME */}

              <div className="form-group payment-form-group">

                <label htmlFor="cardholderName">
                  Cardholder Name
                </label>

                <div className="payment-input-wrapper">

                  <input
                    id="cardholderName"
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    placeholder="Enter cardholder name"
                    autoComplete="cc-name"
                    required
                    disabled={loading}
                  />

                </div>

              </div>

              {/* EXPIRY + CVV */}

              <div className="payment-form-row">

                <div className="form-group payment-form-group">

                  <label htmlFor="expiryDate">
                    Expiry Date
                  </label>

                  <div className="payment-input-wrapper">

                    <input
                      id="expiryDate"
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      required
                      disabled={loading}
                    />

                  </div>

                </div>

                <div className="form-group payment-form-group">

                  <label htmlFor="cvv">
                    CVV
                  </label>

                  <div className="payment-input-wrapper">

                    <input
                      id="cvv"
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="3-digit CVV"
                      maxLength="3"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      required
                      disabled={loading}
                    />

                  </div>

                </div>

              </div>

              {/* SECURITY MESSAGE */}

              <div className="payment-security-box">

                <span className="payment-security-icon">
                  🔒
                </span>

                <div>

                  <strong>
                    Secure Payment
                  </strong>

                  <p>
                    Your payment information is processed
                    securely.
                  </p>

                </div>

              </div>

              {/* PAYMENT BUTTON */}

              <button
                type="submit"
                className="pay-now-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="payment-spinner"></span>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay Now →
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

        {/* ==========================================
            RIGHT SIDE - ORDER INFORMATION
        ========================================== */}

        <aside className="payment-summary">

          <div className="payment-summary-header">

            <h2>Payment Summary</h2>

            <span>
              Order #{orderId}
            </span>

          </div>

          <div className="payment-summary-icon">
            🛍️
          </div>

          <h3>
            Complete Your Order
          </h3>

          <p className="payment-summary-text">

            Your order has been created successfully.
            Complete the payment to continue.

          </p>

          <div className="payment-summary-divider"></div>

          <div className="payment-summary-row">

            <span>
              Order ID
            </span>

            <strong>
              #{orderId}
            </strong>

          </div>

          <div className="payment-summary-row">

            <span>
              Payment Method
            </span>

            <strong>
              Card
            </strong>

          </div>

          <div className="payment-summary-divider"></div>

          <div className="payment-security-note">

            <span>
              🛡️
            </span>

            <p>
              Do not share your card number, CVV or
              other payment details with anyone.
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Payment;