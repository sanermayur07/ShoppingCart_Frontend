import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCartItems,
  getCartTotal,
  getAddresses,
  checkoutOrder,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [total, setTotal] = useState(0);

  const [selectedAddress, setSelectedAddress] = useState('');

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadCheckoutData = async () => {
      try {
        setLoading(true);
        setError('');

        const [items, cartTotal, userAddresses] =
          await Promise.all([
            getCartItems(user.userId),
            getCartTotal(user.userId),
            getAddresses(user.userId),
          ]);

        setCartItems(items);
        setTotal(cartTotal);
        setAddresses(userAddresses);

        const defaultAddress = userAddresses.find(
          (address) => address.isDefault === true
        );

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.addressId);
        } else if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0].addressId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [user]);

 const handlePlaceOrder = async () => {
  setError('');

  // Prevent checkout with an empty cart
  if (cartItems.length === 0) {
    setError('Your cart is empty. Please add products before placing an order.');
    return;
  }

  // Prevent checkout without an address
  if (!selectedAddress) {
    setError('Please select a delivery address.');
    return;
  }

  // Prevent duplicate order requests
  if (placingOrder) {
    return;
  }

  try {
    setPlacingOrder(true);

    const order = await checkoutOrder(user.userId);

    navigate(`/payment/${order.orderId}`);
  } catch (err) {
    setError(err.message);
  } finally {
    setPlacingOrder(false);
  }
};

  if (!user) {
    return (
      <div className="page-message">
        <h1>Checkout</h1>
        <p>Please login to continue.</p>

        <button onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <h2 className="page-message">
        Loading checkout...
      </h2>
    );
  }

  return (
  <div className="checkout-page">

    <div className="checkout-header">
      <div>
        <h1>Checkout</h1>
        <p>Review your order and select a delivery address.</p>
      </div>

      <Link
        to="/cart"
        className="checkout-back-link"
      >
        ← Back to Cart
      </Link>
    </div>

    {error && (
      <p className="error-message checkout-error">
        {error}
      </p>
    )}

    {cartItems.length === 0 ? (
      <div className="checkout-empty">
        <div className="checkout-empty-icon">
          🛒
        </div>

        <h2>Your cart is empty</h2>

        <p>
          Add some products to your cart before proceeding
          to checkout.
        </p>

        <Link to="/products">
          <button className="checkout-primary-button">
            Continue Shopping
          </button>
        </Link>
      </div>
    ) : (
      <div className="checkout-layout">

        {/* LEFT SIDE */}
        <div className="checkout-main">

          {/* DELIVERY ADDRESS */}
          <section className="checkout-section checkout-address-section">

            <div className="checkout-section-header">
              <div>
                <span className="checkout-step-number">
                  1
                </span>

                <div>
                  <h2>Delivery Address</h2>
                  <p>
                    Select where you want your order delivered.
                  </p>
                </div>
              </div>

              <Link
                to="/address"
                className="checkout-add-address-link"
              >
                + Add Address
              </Link>
            </div>

            {addresses.length === 0 ? (
              <div className="no-address-box">

                <div className="no-address-icon">
                  📍
                </div>

                <div>
                  <h3>No saved address</h3>

                  <p>
                    Please add a delivery address before
                    placing your order.
                  </p>
                </div>

                <Link
                  to="/address"
                  className="checkout-add-address-button"
                >
                  Add Address
                </Link>

              </div>
            ) : (
              <div className="checkout-addresses">

                {addresses.map((address) => (
                  <label
                    className={`checkout-address ${
                      String(selectedAddress) ===
                      String(address.addressId)
                        ? 'selected'
                        : ''
                    }`}
                    key={address.addressId}
                  >

                    <input
                      type="radio"
                      name="address"
                      value={address.addressId}
                      checked={
                        String(selectedAddress) ===
                        String(address.addressId)
                      }
                      onChange={(e) =>
                        setSelectedAddress(
                          e.target.value
                        )
                      }
                    />

                    <div className="checkout-address-content">

                      <div className="checkout-address-top">

                        <h3>
                          {address.fullName}
                        </h3>

                        {address.isDefault && (
                          <span className="default-address-badge">
                            Default
                          </span>
                        )}

                      </div>

                      <p>
                        {address.addressLine}
                      </p>

                      <p>
                        {address.city},{' '}
                        {address.state} -{' '}
                        {address.postalCode}
                      </p>

                      <p className="checkout-address-phone">
                        📞 {address.phone}
                      </p>

                    </div>

                  </label>
                ))}

              </div>
            )}
          </section>


          {/* ORDER ITEMS */}
          <section className="checkout-section checkout-items-section">

            <div className="checkout-section-header">
              <div>
                <span className="checkout-step-number">
                  2
                </span>

                <div>
                  <h2>Order Items</h2>

                  <p>
                    {cartItems.length}{' '}
                    {cartItems.length === 1
                      ? 'product'
                      : 'products'}{' '}
                    in your order.
                  </p>
                </div>
              </div>
            </div>

            <div className="checkout-items">

              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item.cartItemId}
                >

                  <div className="checkout-item-image-wrapper">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="checkout-item-image"
                      />
                    ) : (
                      <div className="checkout-item-image-placeholder">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="checkout-item-info">

                    <h3>
                      {item.product?.name}
                    </h3>

                    <p className="checkout-item-category">
                      {item.product?.category || 'Product'}
                    </p>

                    <div className="checkout-item-details">

                      <span>
                        ₹
                        {Number(
                          item.product?.price || 0
                        ).toFixed(2)}
                      </span>

                      <span>
                        × {item.quantity}
                      </span>

                    </div>

                  </div>

                  <div className="checkout-item-total">
                    ₹
                    {(
                      Number(item.product?.price || 0) *
                      item.quantity
                    ).toFixed(2)}
                  </div>

                </div>
              ))}

            </div>

          </section>

        </div>


        {/* RIGHT SIDE - ORDER SUMMARY */}
        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="checkout-summary-count">
            {cartItems.length}{' '}
            {cartItems.length === 1
              ? 'Product'
              : 'Products'}
          </div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>

            <span>
              ₹{Number(total).toFixed(2)}
            </span>
          </div>

          <div className="checkout-summary-row">
            <span>Delivery</span>

            <span className="checkout-free-delivery">
              FREE
            </span>
          </div>

          <div className="checkout-summary-divider"></div>

          <div className="checkout-summary-total">
            <span>Total</span>

            <strong>
              ₹{Number(total).toFixed(2)}
            </strong>
          </div>

          <div className="checkout-payment-note">
            <span>🔒</span>

            <p>
              Secure checkout. You will proceed to
              payment after placing the order.
            </p>
          </div>

          {addresses.length > 0 && (
            <button
              className="place-order-button"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? (
                'Placing Order...'
              ) : (
                'Place Order →'
              )}
            </button>
          )}

          <Link
            to="/cart"
            className="checkout-summary-back"
          >
            ← Return to Cart
          </Link>

        </aside>

      </div>
    )}

  </div>
);

}

export default Checkout;