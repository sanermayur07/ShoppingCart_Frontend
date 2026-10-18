import { FiShoppingCart, FiUsers, FiShield, FiTruck } from 'react-icons/fi';

function About() {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">ABOUT OUR STORE</span>

          <h1>
            Making Online Shopping
            <span> Simple & Enjoyable</span>
          </h1>

          <p>
            Welcome to Shopping Cart — a modern e-commerce platform designed
            to make your online shopping experience simple, secure, and
            convenient.
          </p>

          <a href="#about-story" className="about-hero-btn">
            Discover More
          </a>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story" id="about-story">
        <div className="about-story-image">
          <div className="story-icon">
            <FiShoppingCart />
          </div>
        </div>

        <div className="about-story-content">
          <span className="section-label">WHO WE ARE</span>

          <h2>
            Your Everyday Shopping
            <span> Made Easier</span>
          </h2>

          <p>
            Shopping Cart is an online shopping platform created to provide
            customers with a smooth and user-friendly way to discover and
            purchase products.
          </p>

          <p>
            From browsing products to managing your cart and placing orders,
            our platform focuses on providing a simple and reliable shopping
            experience.
          </p>

          <div className="about-highlights">
            <div>
              <strong>100+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Shopping</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <div className="about-section-heading">
          <span className="section-label">WHY SHOP WITH US</span>

          <h2>
            Everything You Need,
            <span> In One Place</span>
          </h2>

          <p>
            We focus on creating a convenient and reliable shopping
            experience for every customer.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <FiShoppingCart />
            </div>

            <h3>Easy Shopping</h3>

            <p>
              Browse products, add your favorite items to the cart,
              and manage your shopping easily.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiShield />
            </div>

            <h3>Secure Platform</h3>

            <p>
              We focus on providing a secure shopping environment
              for customers and their account information.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiTruck />
            </div>

            <h3>Simple Orders</h3>

            <p>
              Place and manage your orders through a simple,
              convenient shopping workflow.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiUsers />
            </div>

            <h3>Customer Focused</h3>

            <p>
              Our platform is designed around a clean interface
              and an easy customer experience.
            </p>
          </div>

        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="mission-content">
          <span className="section-label">OUR MISSION</span>

          <h2>
            Technology That Makes
            <span> Shopping Better</span>
          </h2>

          <p>
            Our mission is to build a simple, modern, and accessible
            e-commerce experience where customers can find products,
            manage their shopping carts, and complete orders with ease.
          </p>

          <div className="mission-line"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Ready to Start Shopping?</h2>

        <p>
          Explore our products and find something you love.
        </p>

        <a href="/products" className="about-cta-btn">
          Explore Products
        </a>
      </section>

    </div>
  );
}

export default About;