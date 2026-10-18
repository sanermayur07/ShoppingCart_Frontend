import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCartItems,
  getCartTotal,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadCart = async () => {
      try {
        setLoading(true);
        setError('');

        const [items, cartTotal] = await Promise.all([
          getCartItems(user.userId),
          getCartTotal(user.userId),
        ]);

        setCartItems(items);
        setTotal(cartTotal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // ==========================================
  // UPDATE CART ITEM QUANTITY
  // ==========================================

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    const availableStock = item.product?.quantity ?? 0;

    if (newQuantity > availableStock) {
      setError(
        `Only ${availableStock} item${
          availableStock === 1 ? '' : 's'
        } available in stock.`
      );
      setMessage('');
      return;
    }

    try {
      setError('');
      setMessage('');
      setUpdatingItemId(item.cartItemId);

      await updateCartQuantity(
        user.userId,
        item.cartItemId,
        newQuantity
      );

      const [items, cartTotal] = await Promise.all([
        getCartItems(user.userId),
        getCartTotal(user.userId),
      ]);

      setCartItems(items);
      setTotal(cartTotal);

      setMessage('Cart quantity updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const handleRemove = async (cartItemId) => {
    try {
      setError('');
      setMessage('');

      await removeCartItem(user.userId, cartItemId);

      const [items, cartTotal] = await Promise.all([
        getCartItems(user.userId),
        getCartTotal(user.userId),
      ]);

      setCartItems(items);
      setTotal(cartTotal);

      setMessage('Item removed successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const handleClearCart = async () => {
    try {
      setError('');
      setMessage('');

      await clearCart(user.userId);

      setCartItems([]);
      setTotal(0);

      setMessage('Cart cleared successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="page-message">
        <h1>Your Cart</h1>
        <p>Please login to view your cart.</p>
        <button onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <h2 className="page-message">
        Loading cart...
      </h2>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-header">
        <div>
          <h1>Shopping Cart</h1>

          <p>
            {cartItems.length}{' '}
            {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <Link
          to="/products"
          className="cart-continue-link"
        >
          ← Continue Shopping
        </Link>
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

      {cartItems.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link to="/products">
            <button className="cart-primary-button">
              Start Shopping
            </button>
          </Link>

        </div>

      ) : (

        <div className="cart-layout">

          {/* Cart Items */}

          <div className="cart-items-section">

            <div className="cart-section-title">
              <h2>Cart Items</h2>

              <span>
                {cartItems.length}{' '}
                {cartItems.length === 1
                  ? 'Product'
                  : 'Products'}
              </span>
            </div>

            <div className="cart-items">

              {cartItems.map((item) => {

                const availableStock =
                  item.product?.quantity ?? 0;

                const isUpdating =
                  updatingItemId === item.cartItemId;

                return (
                  <div
                    className="cart-item"
                    key={item.cartItemId}
                  >

                    {/* Product Image */}

                    <div className="cart-item-image-wrapper">

                      {item.product?.image ? (

                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="cart-item-image"
                        />

                      ) : (

                        <div className="cart-item-image-placeholder">
                          No Image
                        </div>

                      )}

                    </div>

                    {/* Product Information */}

                    <div className="cart-item-info">

                      <h3>
                        {item.product?.name}
                      </h3>

                      <p className="cart-item-category">
                        {item.product?.category || 'Product'}
                      </p>

                      <p className="cart-item-price">
                        ₹{item.product?.price}
                      </p>

                      {/* Quantity Controls */}

                      <div className="cart-item-quantity">

                        <span>
                          Quantity:
                        </span>

                        <div className="quantity-controls">

                          <button
                            type="button"
                            className="quantity-button"
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                item.quantity - 1
                              )
                            }
                            disabled={
                              isUpdating ||
                              item.quantity <= 1
                            }
                          >
                            −
                          </button>

                          <strong className="quantity-value">
                            {item.quantity}
                          </strong>

                          <button
                            type="button"
                            className="quantity-button"
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              isUpdating ||
                              item.quantity >= availableStock
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      <p className="cart-item-subtotal">
                        Subtotal:
                        <strong>
                          ₹
                          {(
                            Number(item.product?.price || 0) *
                            item.quantity
                          ).toFixed(2)}
                        </strong>
                      </p>

                    </div>

                    {/* Remove Button */}

                    <div className="cart-item-actions">

                      <button
                        className="cart-remove-button"
                        onClick={() =>
                          handleRemove(item.cartItemId)
                        }
                        disabled={isUpdating}
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* Order Summary */}

          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{Number(total).toFixed(2)}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span className="free-delivery">
                FREE
              </span>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{Number(total).toFixed(2)}
              </strong>

            </div>

            <div className="cart-summary-actions">

              <Link
                to="/checkout"
                className="checkout-button"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="continue-shopping-button"
              >
                Continue Shopping
              </Link>

              <button
                className="clear-cart-button"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>

            </div>

          </aside>

        </div>

      )}

    </div>
  );
}

export default Cart;