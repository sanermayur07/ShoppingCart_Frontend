
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiMapPin,
  FiMail,
  FiPhone,
  FiX,
  FiChevronRight,
  FiLogOut,
  FiHome,
  FiShield,
} from 'react-icons/fi';

function Navbar() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const closeProfile = () => setProfileOpen(false);

  const name =
    user?.name ||
    user?.fullName ||
    user?.username ||
    'My Account';

  const email = user?.email || 'Email not available';

  const phone =
    user?.phoneNumber ||
    user?.phone ||
    user?.mobileNumber ||
    '';

  const rawAddress = user?.address;

  const address =
    typeof rawAddress === 'string'
      ? rawAddress
      : rawAddress && typeof rawAddress === 'object'
        ? [
            rawAddress.addressLine,
            rawAddress.street,
            rawAddress.city,
            rawAddress.state,
            rawAddress.pincode,
          ]
            .filter(Boolean)
            .join(', ')
        : '';

  const initial = name.charAt(0).toUpperCase();

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-brand">
          <Link
            to="/"
            className="navbar-logo"
            onClick={closeProfile}
          >
            <span className="logo-icon">
              <FiShoppingCart />
            </span>
            <span className="logo-text">Shopping Cart</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/" onClick={closeProfile}>Home</Link>
          <Link to="/products" onClick={closeProfile}>Products</Link>

          {user && (
            <>
              <Link to="/cart" onClick={closeProfile}>Cart</Link>
              {/* <Link to="/address" onClick={closeProfile}>Addresses</Link> */}
              <Link to="/orders" onClick={closeProfile}>Orders</Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" onClick={closeProfile}>Login</Link>
              <Link to="/register" onClick={closeProfile}>Register</Link>
            </>
          ) : (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/admin" onClick={closeProfile}>Admin</Link>
              )}

              {/* Profile icon only */}
              <button
                type="button"
                className="navbar-profile-icon"
                onClick={() => setProfileOpen(true)}
                aria-label="Open profile"
                aria-expanded={profileOpen}
                title="My Account"
              >
                <FiUser />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Profile Sidebar */}
      {user && profileOpen && (
        <div className="shop-profile-layer">
          <button
            type="button"
            className="shop-profile-backdrop"
            onClick={closeProfile}
            aria-label="Close profile"
          />

          <aside
            className="shop-profile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="My account"
          >
            {/* Profile Header */}
            <div className="shop-profile-header">
              <div className="shop-profile-header-top">
                <div>
                  <span className="shop-profile-eyebrow">
                    YOUR ACCOUNT
                  </span>
                  <h2>My Account</h2>
                </div>

                <button
                  type="button"
                  className="shop-profile-close"
                  onClick={closeProfile}
                  aria-label="Close profile"
                >
                  <FiX />
                </button>
              </div>

              <div className="shop-profile-user">
                <div className="shop-profile-large-avatar">
                  {initial}
                </div>

                <div className="shop-profile-user-info">
                  <h3>{name}</h3>
                  <p>{email}</p>

                  {user.role === 'ADMIN' && (
                    <span className="shop-profile-admin-badge">
                      <FiShield />
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="shop-profile-quick-links">
              <Link
                to="/cart"
                onClick={closeProfile}
                className="shop-profile-quick-card"
              >
                <span className="shop-profile-quick-icon cart-icon">
                  <FiShoppingCart />
                </span>
                <span>My Cart</span>
                <FiChevronRight className="shop-profile-chevron" />
              </Link>

              <Link
                to="/orders"
                onClick={closeProfile}
                className="shop-profile-quick-card"
              >
                <span className="shop-profile-quick-icon order-icon">
                  <FiPackage />
                </span>
                <span>My Orders</span>
                <FiChevronRight className="shop-profile-chevron" />
              </Link>
            </div>

            {/* Personal Information */}
            <div className="shop-profile-section">
              <h4>Personal Information</h4>

              <div className="shop-profile-detail">
                <span className="shop-profile-detail-icon">
                  <FiUser />
                </span>
                <div className="shop-profile-detail-content">
                  <span className="shop-profile-detail-label">
                    Full Name
                  </span>
                  <span className="shop-profile-detail-value">
                    {name}
                  </span>
                </div>
              </div>

              <div className="shop-profile-detail">
                <span className="shop-profile-detail-icon">
                  <FiMail />
                </span>
                <div className="shop-profile-detail-content">
                  <span className="shop-profile-detail-label">
                    Email Address
                  </span>
                  <span className="shop-profile-detail-value">
                    {email}
                  </span>
                </div>
              </div>

              {phone && (
                <div className="shop-profile-detail">
                  <span className="shop-profile-detail-icon">
                    <FiPhone />
                  </span>
                  <div className="shop-profile-detail-content">
                    <span className="shop-profile-detail-label">
                      Phone Number
                    </span>
                    <span className="shop-profile-detail-value">
                      {phone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="shop-profile-section">
              <div className="shop-profile-section-heading">
                <h4>Delivery Address</h4>
                <Link to="/address" onClick={closeProfile}>
                  Manage
                </Link>
              </div>

              <div className="shop-profile-address-card">
                <span className="shop-profile-address-icon">
                  <FiMapPin />
                </span>

                <div className="shop-profile-detail-content">
                  <span className="shop-profile-detail-label">
                    Saved Address
                  </span>
                  <span className="shop-profile-detail-value">
                    {address || 'No address available'}
                  </span>

                  {!address && (
                    <Link
                      to="/address"
                      className="shop-profile-add-address"
                      onClick={closeProfile}
                    >
                      Add delivery address
                      <FiChevronRight />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Account Services */}
            <div className="shop-profile-section shop-profile-menu">
              <h4>Account Services</h4>

              <Link
                to="/address"
                onClick={closeProfile}
                className="shop-profile-menu-link"
              >
                <span className="shop-profile-menu-icon">
                  <FiMapPin />
                </span>
                <span>My Addresses</span>
                <FiChevronRight className="shop-profile-chevron" />
              </Link>

              <Link
                to="/cart"
                onClick={closeProfile}
                className="shop-profile-menu-link"
              >
                <span className="shop-profile-menu-icon">
                  <FiShoppingCart />
                </span>
                <span>Shopping Cart</span>
                <FiChevronRight className="shop-profile-chevron" />
              </Link>

              <Link
                to="/orders"
                onClick={closeProfile}
                className="shop-profile-menu-link"
              >
                <span className="shop-profile-menu-icon">
                  <FiPackage />
                </span>
                <span>Order History</span>
                <FiChevronRight className="shop-profile-chevron" />
              </Link>

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={closeProfile}
                  className="shop-profile-menu-link"
                >
                  <span className="shop-profile-menu-icon">
                    <FiHome />
                  </span>
                  <span>Admin Dashboard</span>
                  <FiChevronRight className="shop-profile-chevron" />
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="shop-profile-footer">
              <button
                type="button"
                className="shop-profile-logout"
                onClick={() => {
                  closeProfile();
                  logout();
                }}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>

              <p>Thank you for shopping with us!</p>
            </div>
          </aside>
        </div>
      )}

      {/* Profile Icon and Sidebar Styles Only */}
      <style>{`
        /* Navbar profile icon */
        .navbar .navbar-profile-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          padding: 0;
          border: 1px solid transparent;
          border-radius: 50%;
          background: transparent;
          color: inherit;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: color .2s ease, background .2s ease,
            border-color .2s ease, transform .2s ease;
        }

        .navbar .navbar-profile-icon:hover {
          color: #4338ca;
          background: #eef2ff;
          border-color: #e0e7ff;
          transform: translateY(-1px);
        }

        .navbar .navbar-profile-icon:focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 3px;
        }

        /* Overlay */
        .shop-profile-layer {
          position: fixed;
          inset: 0;
          z-index: 2000;
          isolation: isolate;
        }

        .shop-profile-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          border: none;
          background: rgba(15, 23, 42, .48);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          cursor: default;
          animation: shopProfileFade .22s ease both;
        }

        /* Sidebar */
        .shop-profile-sidebar {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          width: min(420px, 94vw);
          height: 100vh;
          height: 100dvh;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: #fff;
          color: #1e293b;
          box-shadow: -16px 0 50px rgba(15, 23, 42, .18);
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
          animation: shopProfileSlide .28s cubic-bezier(.2, .75, .25, 1) both;
        }

        .shop-profile-sidebar *,
        .shop-profile-sidebar *::before,
        .shop-profile-sidebar *::after {
          box-sizing: border-box;
        }

        /* Header */
        .shop-profile-header {
          padding: 25px 24px 27px;
          background: linear-gradient(145deg, #f8faff, #eef2ff);
          border-bottom: 1px solid #e8ecf5;
        }

        .shop-profile-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 27px;
        }

        .shop-profile-eyebrow {
          display: inline-block;
          color: #6366f1;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .shop-profile-header h2 {
          margin: 6px 0 0;
          color: #111827;
          font-size: 24px;
          line-height: 1.3;
          font-weight: 800;
          letter-spacing: -.6px;
        }

        .shop-profile-close {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          background: #fff;
          color: #475569;
          font-size: 19px;
          cursor: pointer;
          transition: background .2s, color .2s, transform .2s;
        }

        .shop-profile-close:hover {
          background: #e0e7ff;
          color: #4338ca;
          transform: rotate(90deg);
        }

        .shop-profile-user {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
        }

        .shop-profile-large-avatar {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 66px;
          height: 66px;
          border: 3px solid #fff;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff;
          font-size: 27px;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(79, 70, 229, .22);
        }

        .shop-profile-user-info {
          flex: 1;
          min-width: 0;
        }

        .shop-profile-user-info h3 {
          margin: 0 0 6px;
          color: #111827;
          font-size: 17px;
          line-height: 1.4;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .shop-profile-user-info p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .shop-profile-admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 9px;
          padding: 5px 9px;
          border: 1px solid #c7d2fe;
          border-radius: 20px;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 10px;
          font-weight: 750;
        }

        /* Quick links */
        .shop-profile-quick-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 21px 24px;
          border-bottom: 1px solid #edf0f5;
        }

        .shop-profile-quick-card {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          min-height: 63px;
          padding: 11px;
          border: 1px solid #e5eaf2;
          border-radius: 12px;
          background: #fff;
          color: #334155;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 2px 5px rgba(15, 23, 42, .025);
          transition: border-color .2s, background .2s,
            box-shadow .2s, transform .2s;
        }

        .shop-profile-quick-card:hover {
          border-color: #c7d2fe;
          background: #fafaff;
          box-shadow: 0 5px 14px rgba(79, 70, 229, .07);
          transform: translateY(-2px);
        }

        .shop-profile-quick-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          font-size: 17px;
        }

        .shop-profile-quick-icon.cart-icon {
          background: #fff7ed;
          color: #ea580c;
        }

        .shop-profile-quick-icon.order-icon {
          background: #ecfdf5;
          color: #059669;
        }

        /* Sections */
        .shop-profile-section {
          padding: 23px 24px;
          border-bottom: 1px solid #edf0f5;
        }

        .shop-profile-section h4 {
          margin: 0 0 19px;
          color: #111827;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 800;
        }

        .shop-profile-detail {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          min-width: 0;
          margin-bottom: 19px;
        }

        .shop-profile-detail:last-child {
          margin-bottom: 0;
        }

        .shop-profile-detail-icon,
        .shop-profile-address-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 39px;
          height: 39px;
          border: 1px solid #edf0f5;
          border-radius: 11px;
          background: #f8fafc;
          color: #6366f1;
          font-size: 17px;
        }

        .shop-profile-detail-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;
          padding-top: 2px;
        }

        .shop-profile-detail-label {
          margin-bottom: 5px;
          // color: #94a3b8;
          color: #334155;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .65px;
          text-transform: uppercase;
        }

        .shop-profile-detail-value {
          color: #334155;
          font-size: 12px;
          line-height: 1.75;
          overflow-wrap: anywhere;
        }

        /* Delivery address */
        .shop-profile-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .shop-profile-section-heading h4 {
          margin-bottom: 16px;
        }

        .shop-profile-section-heading > a {
          flex-shrink: 0;
          margin-bottom: 16px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .shop-profile-section-heading > a:hover,
        .shop-profile-add-address:hover {
          color: #3730a3;
          text-decoration: underline;
        }

        .shop-profile-address-card {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 15px;
          border: 1px solid #e5eaf2;
          border-radius: 12px;
          background: #fafbff;
          transition: border-color .2s, background .2s;
        }

        .shop-profile-address-card:hover {
          border-color: #d7dcf8;
          background: #f8f9ff;
        }

        .shop-profile-address-icon {
          background: #eef2ff;
          border-color: #e0e7ff;
        }

        .shop-profile-add-address {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 9px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        /* Account services */
        .shop-profile-menu {
          padding-bottom: 19px;
        }

        .shop-profile-menu h4 {
          margin-bottom: 13px;
        }

        .shop-profile-menu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 49px;
          margin-bottom: 5px;
          padding: 7px 10px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: #334155;
          text-decoration: none;
          font-size: 12px;
          font-weight: 650;
          transition: background .2s, color .2s, border-color .2s;
        }

        .shop-profile-menu-link:hover {
          border-color: #ede9fe;
          background: #f7f5ff;
          color: #4338ca;
        }

        .shop-profile-menu-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 35px;
          height: 35px;
          border: 1px solid #edf0f5;
          border-radius: 10px;
          background: #f8fafc;
          color: #64748b;
          font-size: 16px;
          transition: background .2s, color .2s;
        }

        .shop-profile-menu-link:hover .shop-profile-menu-icon {
          border-color: #e0e7ff;
          background: #e0e7ff;
          color: #4338ca;
        }

        .shop-profile-chevron {
          flex-shrink: 0;
          margin-left: auto;
          color: #94a3b8;
          font-size: 16px;
          transition: transform .2s, color .2s;
        }

        .shop-profile-menu-link:hover .shop-profile-chevron,
        .shop-profile-quick-card:hover .shop-profile-chevron {
          color: #6366f1;
          transform: translateX(2px);
        }

        /* Footer */
        .shop-profile-footer {
          margin-top: auto;
          padding: 20px 24px 24px;
          border-top: 1px solid #edf0f5;
          background: #fff;
        }

        .shop-profile-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          min-height: 46px;
          // border: 1px solid #fecdd3;
          border-radius: 10px;
          // background: #fff7f7;
          // color: #be123c;
          background-color: #e8164b; 
          color: #fff7f7;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: background .2s, border-color .2s, transform .2s;
        }

        .shop-profile-logout:hover {
          //border-color: #fda4af;
          border-color: #e8164b;
          //background: #fff1f2;
          background: #e8164b;
          transform: translateY(-1px);
        }

        .shop-profile-footer > p {
          margin: 14px 0 0;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.6;
          text-align: center;
        }

        /* Animations */
        @keyframes shopProfileFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shopProfileSlide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* Mobile responsive */
        @media (max-width: 600px) {
          .shop-profile-sidebar {
            width: min(390px, 100vw);
          }

          .shop-profile-header {
            padding: 21px 18px 23px;
          }

          .shop-profile-header-top {
            margin-bottom: 22px;
          }

          .shop-profile-header h2 {
            font-size: 22px;
          }

          .shop-profile-large-avatar {
            width: 58px;
            height: 58px;
            font-size: 24px;
          }

          .shop-profile-quick-links {
            gap: 8px;
            padding: 16px 14px;
          }

          .shop-profile-quick-card {
            gap: 7px;
            padding: 9px 7px;
            font-size: 11px;
          }

          .shop-profile-quick-icon {
            width: 31px;
            height: 31px;
            font-size: 15px;
          }

          .shop-profile-section {
            padding: 20px 18px;
          }

          .shop-profile-footer {
            padding: 18px;
          }
        }

        @media (max-width: 360px) {
          .shop-profile-user {
            gap: 10px;
          }

          .shop-profile-user-info h3 {
            font-size: 15px;
          }

          .shop-profile-user-info p {
            font-size: 11px;
          }

          .shop-profile-quick-card {
            gap: 5px;
            font-size: 10px;
          }
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .shop-profile-backdrop,
          .shop-profile-sidebar {
            animation: none;
          }

          .navbar .navbar-profile-icon,
          .shop-profile-close,
          .shop-profile-quick-card,
          .shop-profile-menu-link,
          .shop-profile-menu-icon,
          .shop-profile-chevron,
          .shop-profile-logout,
          .shop-profile-address-card {
            transition: none;
          }
        }

        
      `}</style>
    </>
  );
}

export default Navbar;
